"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { imagekit } from "@/lib/imagekit";

/* ---------------- UPSERT TEAM MEMBER ---------------- */
export const upsertTeam = async (formData: FormData) => {
  try {
    const id = (formData.get("id") as string) || "";
    const name = (formData.get("name") as string) || "";
    const role = (formData.get("role") as string) || "";
    const memberType = (formData.get("memberType") as string) || "member";
    const bio = (formData.get("bio") as string) || "";
    const expertise = (formData.get("expertise") as string) || "";
    const email = (formData.get("email") as string) || "";
    const linkedin = (formData.get("linkedin") as string) || "";
    const facebook = (formData.get("facebook") as string) || "";
    const twitter = (formData.get("twitter") as string) || "";
    const instagram = (formData.get("instagram") as string) || "";

    const parseArray = (key: string) => {
      try {
        const raw = formData.get(key) as string;
        const parsed = JSON.parse(raw || "[]");
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    };

    const education = parseArray("education");
    const achievements = parseArray("achievements");
    const experience = parseArray("experience");

    const existingImage = (formData.get("existingImage") as string) || "";
    const newFile = formData.get("image") as File | null;
    let imageUrl = existingImage;

    if (newFile && newFile.size > 0) {
      const buffer = Buffer.from(await newFile.arrayBuffer());
      const result = await imagekit.upload({
        file: buffer,
        fileName: `team_${Date.now()}_${newFile.name.replace(/\s+/g, "_")}`,
        folder: "team",
      });
      imageUrl = result.url;
    }

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const teamData: any = { 
      name, 
      slug, 
      role, 
      memberType,
      bio, 
      expertise, 
      email, 
      linkedin,
      facebook,
      twitter,
      instagram,
      image: imageUrl, 
      education, 
      achievements, 
      experience 
    };

    let member;
    if (id && id.trim() !== "" && id !== "undefined") {
      // UPDATE EXISTING
      member = await db.team.update({
        where: { id },
        data: teamData,
      });
    } else {
      // CREATE NEW: Find highest current order to place at the end
      const lastMember = await db.team.findFirst({
        where: { isDeleted: false },
        orderBy: { order: "desc" },
        select: { order: true },
      });

      const nextOrder = lastMember ? lastMember.order + 1 : 0;

      member = await db.team.create({
        data: { 
          ...teamData, 
          order: nextOrder 
        },
      });
    }

    revalidatePath("/admin/team");
    revalidatePath("/team");
    revalidatePath(`/team/${slug}`);

    return { success: true, data: member };
  } catch (error: any) {
    console.error("Team Save Error:", error);
    return { success: false, error: error.message || "Failed to save team member" };
  }
};

/* ---------------- REORDER TEAM MEMBERS ---------------- */
/**
 * Updates multiple members' positions in a single database transaction.
 */
export const reorderTeam = async (items: { id: string; order: number }[]) => {
  try {
    await db.$transaction(
      items.map((item) =>
        db.team.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );

    revalidatePath("/admin/team");
    revalidatePath("/team");
    return { success: true };
  } catch (error: any) {
    console.error("Reorder Error:", error);
    return { success: false, error: "Failed to save new order" };
  }
};

/* ---------------- GET TEAM MEMBERS ---------------- */
export const getTeamMembers = async (trashed: boolean = false) => {
  try {
    const members = await db.team.findMany({
      where: trashed ? { isDeleted: true } : { isDeleted: false },
      orderBy: { order: "asc" }, // Crucial: Sort by order, not createdAt
    });
    return { success: true, data: members };
  } catch (error: any) {
    console.error("Fetch Team Error:", error);
    return { success: false, error: error.message || "Failed to fetch team members" };
  }
};

/* ---------------- GET SINGLE MEMBER BY SLUG ---------------- */
export const getTeamMemberBySlug = async (slug: string) => {
  try {
    const member = await db.team.findUnique({
      where: { slug },
    });
    return { success: true, data: member };
  } catch (error: any) {
    console.error("Get Team Member Error:", error);
    return { success: false, error: error.message || "Member not found" };
  }
};

/* ---------------- SOFT DELETE (MOVE TO TRASH) ---------------- */
export const moveTeamToTrash = async (id: string) => {
  try {
    await db.team.update({
      where: { id },
      data: { isDeleted: true, deletedAt: new Date() },
    });
    revalidatePath("/admin/team");
    return { success: true };
  } catch (error: any) {
    console.error("Move to Trash Error:", error);
    return { success: false, error: error.message || "Failed to move team member to trash" };
  }
};

/* ---------------- RESTORE FROM TRASH ---------------- */
export const restoreTeamMember = async (id: string) => {
  try {
    await db.team.update({
      where: { id },
      data: { isDeleted: false, deletedAt: null },
    });
    revalidatePath("/admin/team");
    return { success: true };
  } catch (error: any) {
    console.error("Restore Team Member Error:", error);
    return { success: false, error: error.message || "Failed to restore team member" };
  }
};

/* ---------------- PERMANENT DELETE ---------------- */
export const deleteTeamPermanent = async (id: string) => {
  try {
    await db.team.delete({
      where: { id },
    });
    revalidatePath("/admin/team");
    return { success: true };
  } catch (error: any) {
    console.error("Permanent Delete Team Member Error:", error);
    return { success: false, error: error.message || "Failed to permanently delete team member" };
  }
};