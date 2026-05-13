"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { imagekit } from "@/lib/imagekit";
import { generateSlug } from "@/lib/slugify";

const MAX_GALLERY_IMAGES = 12;
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const MAX_IMAGE_SIZE_LABEL = "5MB";

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
    const uploadedFiles = files.filter((file) => file.size > 0);

    if (uploadedFiles.some((file) => file.size > MAX_IMAGE_SIZE_BYTES)) {
      return {
        success: false,
        error: `Each image must be ${MAX_IMAGE_SIZE_LABEL} or smaller.`,
      };
    }

    let remainingImageCount = 0;

    if (id) {
      const existingItem = await db.galleryItem.findUnique({
        where: { id: Number(id) },
        select: { slug: true, categorySlug: true },
      });

      if (!existingItem) {
        return { success: false, error: "Gallery album not found." };
      }

      const existingImageCount = await db.galleryItem.count({
        where: {
          slug: existingItem.slug,
          categorySlug: existingItem.categorySlug,
        },
      });

      remainingImageCount = Math.max(0, existingImageCount - removedImageIds.length);
    }

    const totalImageCount = remainingImageCount + uploadedFiles.length;

    if (totalImageCount === 0) {
      return { success: false, error: "Please upload at least one image." };
    }

    if (totalImageCount > MAX_GALLERY_IMAGES) {
      return {
        success: false,
        error: `You can upload up to ${MAX_GALLERY_IMAGES} images per album.`,
      };
    }

    // 1. Handle Deletions first if updating
    if (removedImageIds.length > 0) {
      await db.galleryItem.deleteMany({
        where: {
          id: { in: removedImageIds.map((id) => Number(id)) },
        },
      });
    }

    // 2. Parallel Uploads to ImageKit
    const uploadPromises = uploadedFiles
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
      const existingItem = await db.galleryItem.findUnique({
        where: { id: Number(id) },
        select: { slug: true, categorySlug: true },
      });

      if (!existingItem) {
        return { success: false, error: "Gallery album not found." };
      }

      await db.galleryItem.updateMany({
        where: {
          slug: existingItem.slug,
          categorySlug: existingItem.categorySlug,
        },
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
  } catch (error: unknown) {
    console.error("Gallery Save Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save gallery",
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
  } catch {
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