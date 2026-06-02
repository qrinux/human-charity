"use client";

import React, { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  ImageIcon,
  Tag,
  Images,
  LayoutGrid,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useGallery } from "@/components/Hooks/useGallery";
import { toast } from "sonner";
import { deleteGalleryItem, upsertGalleryItem } from "@/app/ServerActions/galleryItem";
import GalleryForm from "./GalleryForm";
import Swal from "sweetalert2";
import Link from "next/link";

type Album = {
  id: number;
  title: string;
  category: string;
  slug: string;
  categorySlug: string;
  cover: string;
  description?: string;
  date?: string;
  items: any[];
};

export default function AdminGalleryPage() {
  const { items, loading, refresh } = useGallery();
  const [showForm, setShowForm] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ FIXED: group by slug-based key so Bengali titles work correctly
  const groupedAlbums: Album[] = Object.values(
    items.reduce((acc: Record<string, Album>, item: any) => {
      const key = `${item.categorySlug}-${item.slug}`;
      if (!acc[key]) {
        acc[key] = {
          id: item.id,
          title: item.title,
          category: item.category,
          slug: item.slug,
          categorySlug: item.categorySlug,
          cover: item.url,
          description: item.description,
          date: item.date,
          items: [],
        };
      }
      acc[key].items.push(item);
      return acc;
    }, {})
  );

  // ✅ FIXED: group by original category name for display, keyed by categorySlug
  const categoryGroups: Record<string, Album[]> = groupedAlbums.reduce(
    (acc: Record<string, Album[]>, album: Album) => {
      // Use original category name as display key
      const displayKey = album.category;
      if (!acc[displayKey]) acc[displayKey] = [];
      acc[displayKey].push(album);
      return acc;
    },
    {}
  );

  const handleEdit = (album: Album) => {
    setEditingAlbum({
      ...album,
      images: album.items,
      allItems: items,
    } as any);
    setShowForm(true);
  };

  const handleDeleteAlbum = async (album: Album) => {
    const result = await Swal.fire({
      title: "Delete entire album?",
      text: `${album.title} Album will permanently delete and its ${album.items.length} images.`,
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#334155",
      confirmButtonText: "Yes, delete everything",
    });

    if (!result.isConfirmed) return;

    try {
      for (const img of album.items) {
        await deleteGalleryItem(img.id);
      }
      toast.success("Album deleted successfully");
      refresh();
    } catch (error) {
      toast.error("Failed to delete some images");
    }
  };

  const handleFormSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      const res = await upsertGalleryItem(formData);
      if (res.success) {
        toast.success(editingAlbum ? "Album updated" : "Album published");
        setShowForm(false);
        setEditingAlbum(null);
        refresh();
      } else {
        toast.error(res.error || "Failed to save");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && items.length === 0)
    return (
      <div className="flex flex-col justify-center items-center h-96 gap-4">
        <Loader2 className="animate-spin text-emerald-500" size={48} />
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-10">

      <div className="flex flex-col sm:flex-row justify-between items-end border-b border-slate-300 pb-6">
        <div>
          <h1 className="md:text-4xl text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <LayoutGrid className="text-emerald-600" />
            Gallery Manager
          </h1>
          <p className="text-slate-600 mt-2">
            Organize, edit, and manage your visual stories.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingAlbum(null);
            setShowForm(true);
          }}
          className="group flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg active:scale-95 cursor-pointer mt-4 sm:mt-0"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform" />
          Create New Album
        </button>
      </div>

      <AnimatePresence mode="wait">
        {showForm ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
          >
            <GalleryForm
              initialData={
                editingAlbum
                  ? { ...editingAlbum, allItems: items }
                  : { allItems: items }
              }
              isSubmitting={isSubmitting}
              onClose={() => {
                setShowForm(false);
                setEditingAlbum(null);
              }}
              onSubmit={handleFormSubmit}
            />
          </motion.div>
        ) : (
          <motion.div
            key="albums"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-12"
          >
            {Object.entries(categoryGroups).map(([category, albums]) => (
              <section key={category} className="space-y-6">

                <div className="flex items-center justify-center gap-3">
                  <h2 className="flex items-center gap-2 text-slate-600 font-bold text-sm uppercase tracking-widest bg-white px-4 py-1 rounded-full border border-slate-200">
                    <Tag className="text-emerald-600" size={14} />
                    {category} {/* ✅ Shows original Bengali name */}
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {albums.map((album, index) => (
                    <div
                      key={index}
                      className="group relative bg-white border border-slate-200 rounded-3xl overflow-hidden hover:border-emerald-400 transition-all duration-300 shadow-md"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={album.cover}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          alt={album.title}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent opacity-60" />
                        <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-2">
                          <Images size={14} className="text-emerald-400" />
                          {album.items.length} Photos
                        </div>
                        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEdit(album)}
                            className="p-2.5 bg-black/40 hover:bg-emerald-500 text-white rounded-xl cursor-pointer"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteAlbum(album)}
                            className="p-2.5 bg-black/40 hover:bg-rose-500 text-white rounded-xl cursor-pointer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="p-5">
                        <h3 className="text-slate-900 font-bold truncate text-lg mb-1">
                          {album.title} {/* ✅ Shows original Bengali title */}
                        </h3>
                        <p className="text-slate-600 text-xs line-clamp-1">
                          {album.description || "No description provided."}
                        </p>
                        {/* ✅ FIXED: uses categorySlug and slug for URL */}
                        <Link
                          href={`/admin/dashboard/gallery/${album.categorySlug}/${album.slug}`}
                          className="mt-4 flex items-center justify-center w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors cursor-pointer"
                        >
                          View Gallery Items
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}

            {groupedAlbums.length === 0 && (
              <div className="py-32 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-3xl">
                <div className="bg-slate-100 p-6 rounded-full mb-4">
                  <ImageIcon className="text-slate-500" size={48} />
                </div>
                <h3 className="text-slate-900 font-bold text-xl">No albums found</h3>
                <p className="text-slate-500 max-w-xs text-center mt-2">
                  Start by creating your first gallery album.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
