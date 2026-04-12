"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { imagekit } from "@/lib/imagekit";

/* ---------------- UPSERT NOTICE (existing) ---------------- */
export const upsertNotice = async (formData: FormData) => {
  try {
    const id = (formData.get("id") as string) || "";
    const title = (formData.get("title") as string) || "";
    const description = (formData.get("description") as string) || "";
    const content = (formData.get("content") as string) || "";
    const type = (formData.get("type") as string) || "notice";
    const date = (formData.get("date") as string) || new Date().toISOString();
    const latest = formData.get("latest") === "true";

    // 1. GENERATE SLUG FROM TITLE (Automatic)
    // Filters out Bangla characters and symbols, keeps English words
    const baseSlug = title
      .toLowerCase()
      .trim()
      .replace(/[\u0980-\u09FF]/g, "") // Remove Bangla
      .replace(/[^a-z0-9\s-]/g, "")    // Remove special chars
      .replace(/\s+/g, "-")            // Spaces to hyphens
      .replace(/-+/g, "-")             // Remove double hyphens
      .replace(/^-+|-+$/g, "");        // Trim hyphens

    // Take first 4 words for a clean URL
    const words = baseSlug.split("-").slice(0, 4);
    let slug = words.join("-");

    // Fallback if title was purely Bangla or too short
    if (!slug || slug.length < 3) {
      slug = `notice-${Date.now().toString().slice(-4)}`;
    }

    // 2. IMAGE HANDLING
    const existingImage = (formData.get("existingImage") as string) || "";
    const newFile = formData.get("image") as File | null;
    let imageUrl = existingImage;

    if (newFile && newFile.size > 0) {
      const buffer = Buffer.from(await newFile.arrayBuffer());
      const result = await imagekit.upload({
        file: buffer,
        fileName: `notice_${Date.now()}_${newFile.name.replace(/\s+/g, "_")}`,
        folder: "notices",
      });
      imageUrl = result.url;
    }

    // 3. CHECK FOR UNIQUE SLUG
    const existingNoticeWithSlug = await db.notice.findUnique({
      where: { slug },
    });

    const noticeData: any = { 
      title, 
      slug, 
      description, 
      content, 
      type, 
      date: new Date(date), 
      latest, 
      image: imageUrl 
    };

    // If your DB still requires 'excerpt', we generate it from content
    noticeData.excerpt = content.substring(0, 150).replace(/<[^>]*>/g, '') + "...";

    let notice;

    if (id && id !== "undefined" && id.trim() !== "") {
      // UPDATE: If slug belongs to another record, make this one unique
      if (existingNoticeWithSlug && existingNoticeWithSlug.id !== id) {
        noticeData.slug = `${slug}-${Date.now().toString().slice(-4)}`;
      }
      notice = await db.notice.update({ where: { id }, data: noticeData });
    } else {
      // CREATE: If slug exists, append random suffix
      if (existingNoticeWithSlug) {
        noticeData.slug = `${slug}-${Date.now().toString().slice(-4)}`;
      }
      notice = await db.notice.create({ data: noticeData });
    }

    revalidatePath("/admin/notices");
    revalidatePath("/notices");
    revalidatePath(`/notices/${noticeData.slug}`);

    return { success: true, data: notice };
  } catch (error: any) {
    console.error("Notice Save Error:", error);
    return { success: false, error: error.message || "Failed to save notice" };
  }
};
/* ---------------- GET NOTICES (optional trashed) ---------------- */
export const getNotices = async (trashed: boolean = false) => {
  try {
    const notices = await db.notice.findMany({
      where: trashed ? { deletedAt: { not: null } } : { deletedAt: null },
      orderBy: { date: "desc" },
    });
    return { success: true, data: JSON.parse(JSON.stringify(notices)) };
  } catch (error: any) {
    console.error("Get Notices Error:", error);
    return { success: false, error: "Failed to fetch notices" };
  }
};

/* ---------------- GET NOTICE BY SLUG ---------------- */
export const getNoticeBySlug = async (slug: string) => {
  try {
    const notice = await db.notice.findUnique({ where: { slug } });
    return { success: true, data: JSON.parse(JSON.stringify(notice)) };
  } catch (error: any) {
    return { success: false, error: "Notice not found" };
  }
};

/* ---------------- SOFT DELETE ---------------- */
export const moveNoticeToTrash = async (id: string) => {
  try {
    await db.notice.update({ where: { id }, data: { deletedAt: new Date() } });
    revalidatePath("/admin/notices");
    return { success: true };
  } catch (error: any) {
    console.error("Move Notice to Trash Error:", error);
    return { success: false, error: error.message || "Failed to move notice to trash" };
  }
};

/* ---------------- RESTORE ---------------- */
export const restoreNotice = async (id: string) => {
  try {
    await db.notice.update({ where: { id }, data: { deletedAt: null } });
    revalidatePath("/admin/notices");
    return { success: true };
  } catch (error: any) {
    console.error("Restore Notice Error:", error);
    return { success: false, error: error.message || "Failed to restore notice" };
  }
};

/* ---------------- PERMANENT DELETE ---------------- */
export const deleteNoticePermanent = async (id: string) => {
  try {
    await db.notice.delete({ where: { id } });
    revalidatePath("/admin/notices");
    return { success: true };
  } catch (error: any) {
    console.error("Permanent Delete Notice Error:", error);
    return { success: false, error: error.message || "Delete failed" };
  }
};