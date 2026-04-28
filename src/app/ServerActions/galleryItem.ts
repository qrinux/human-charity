"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { imagekit } from "@/lib/imagekit";
import { generateSlug } from "@/lib/slugify";

/* -------------------------------- */
/* UPSERT GALLERY ITEM (MULTI IMAGE) */
/* -------------------------------- */

export const upsertGalleryItem = async (formData: FormData) => {
  try {
    const id = formData.get("id") as string | null;
    const title = (formData.get("title") as string) || "";
    const category = (formData.get("category") as string) || "";
    const description = (formData.get("description") as string) || "";
    const dateInput = (formData.get("date") as string) || "";
    const files = formData.getAll("images") as File[];

    // Generate URL-safe slugs from title and category (handles Bengali, Arabic, etc.)
    const slug = generateSlug(title);
    const categorySlug = generateSlug(category);

    // Get IDs of images to remove
    const removedImageIds = formData.getAll("removedImages[]") as string[];

    // 1. Handle Deletions first if updating
    if (removedImageIds.length > 0) {
      await db.galleryItem.deleteMany({
        where: {
          id: { in: removedImageIds.map((id) => Number(id)) },
        },
      });
    }

    // 2. Parallel Uploads to ImageKit
    const uploadPromises = files
      .filter((file) => file.size > 0)
      .map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer());

        const uploadResponse = await imagekit.upload({
          file: buffer,
          fileName: `gallery_${Date.now()}_${file.name.replace(/\s+/g, "_")}`,
          folder: "gallery",
        });

        return {
          title,
          slug,
          category,
          categorySlug,
          description,
          url: uploadResponse.url,
          date: new Date(dateInput),
        };
      });

    const newImageData = await Promise.all(uploadPromises);

    // 3. If updating: update metadata of all images in this album
    if (id) {
      await db.galleryItem.updateMany({
        where: { title },
        data: { title, slug, category, categorySlug, description, date: new Date(dateInput) },
      });
    }

    // 4. Create new image entries
    if (newImageData.length > 0) {
      await db.galleryItem.createMany({
        data: newImageData,
      });
    }

    revalidatePath("/admin/gallery");
    revalidatePath("/gallery");

    return { success: true };
  } catch (error: any) {
    console.error("Gallery Save Error:", error);
    return {
      success: false,
      error: error.message || "Failed to save gallery",
    };
  }
};

/* -------------------------------- */
/* DELETE SINGLE IMAGE               */
/* -------------------------------- */

export const deleteGalleryItem = async (id: number) => {
  try {
    await db.galleryItem.delete({
      where: { id: Number(id) },
    });

    revalidatePath("/admin/gallery");
    revalidatePath("/gallery");

    return { success: true };
  } catch (error) {
    return { success: false, error: "Delete failed" };
  }
};

/* -------------------------------- */
/* GET ALL ITEMS                     */
/* -------------------------------- */

export const getGalleryItems = async () => {
  try {
    const items = await db.galleryItem.findMany({
      orderBy: { id: "desc" },
    });

    return { success: true, data: items };
  } catch (error) {
    console.error("Gallery Fetch Error:", error);
    return { success: false, error: "Failed to fetch gallery" };
  }
};