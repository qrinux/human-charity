"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { generateSlug } from "@/lib/slugify";

const MAX_GALLERY_IMAGES = 12;

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
    
    // Retrieve the string array of URLs passed from the client side
    const imageUrlsRaw = formData.get("imageUrls") as string;
    const uploadedUrls: string[] = imageUrlsRaw ? JSON.parse(imageUrlsRaw) : [];

    // Generate URL-safe slugs from title and category (handles Bengali, Arabic, etc.)
    const slug = generateSlug(title);
    const categorySlug = generateSlug(category);

    // Get IDs of images to remove
    const removedImageIds = formData.getAll("removedImages[]") as string[];

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

    const totalImageCount = remainingImageCount + uploadedUrls.length;

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

    // 2. Prepare client-uploaded image URLs for Prisma mapping
    const newImageData = uploadedUrls.map((url: string) => ({
      title,
      slug,
      category,
      categorySlug,
      description,
      url,
      date: new Date(dateInput),
    }));

    // 3. If updating: update metadata of all remaining images in this album
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