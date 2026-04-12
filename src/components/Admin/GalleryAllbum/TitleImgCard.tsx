"use client";

import { useParams } from "next/navigation";
import { useGallery } from "@/components/Hooks/useGallery";
import { Trash2, Pencil, Loader2, ArrowLeft, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import Swal from "sweetalert2";
import { toast } from "sonner";
import { deleteGalleryItem, upsertGalleryItem } from "@/app/ServerActions/galleryItem";
import GalleryForm from "./GalleryForm";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function AdminAlbumPage() {
  const params = useParams();
  const { items, loading, refresh } = useGallery();
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const category = params.category as string;
  const title = decodeURIComponent(params.title as string);

  const albumImages = items.filter(
    (item: any) => item.category === category && item.title === title
  );

  const handleDeleteImage = async (id: number) => {
    const result = await Swal.fire({
      title: "Remove this photo?",
      text: "This specific image will be permanently deleted from the album.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#334155",
      confirmButtonText: "Yes, delete it",
      background: "#1e293b",
      color: "#fff"
    });

    if (!result.isConfirmed) return;

    await deleteGalleryItem(id);
    toast.success("Image removed from album");
    refresh();
  };

  const handleEditImage = (item: any) => {
    const formattedData = {
      ...item,
      images: [item]
    };
    setEditingItem(formattedData);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      const res = await upsertGalleryItem(formData);
      if (res.success) {
        toast.success("Album details updated");
        setShowForm(false);
        setEditingItem(null);
        refresh();
      } else {
        toast.error(res.error || "Failed to update");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="flex flex-col justify-center items-center py-40 gap-4 text-slate-700">
        <Loader2 className="animate-spin text-emerald-500" size={48} />
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8 text-slate-900">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-300 pb-8">
        <div className="flex items-center gap-5">
          <Link
            href="/admin/dashboard/gallery"
            className="group p-3 bg-slate-100 hover:bg-emerald-600 text-slate-700 hover:text-white rounded-2xl transition-all cursor-pointer"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </Link>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded">
                {category}
              </span>
            </div>

            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {title}
            </h1>

            <p className="text-slate-600 text-sm mt-1 flex items-center gap-2">
              <ImageIcon size={14} /> {albumImages.length} Photos in this collection
            </p>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {showForm && editingItem ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <GalleryForm
              initialData={editingItem}
              isSubmitting={isSubmitting}
              onClose={() => {
                setShowForm(false);
                setEditingItem(null);
              }}
              onSubmit={handleFormSubmit}
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {albumImages.map((img: any) => (
              <div
                key={img.id}
                className="group relative bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-lg hover:border-emerald-500/50 transition-all"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={img.url}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    alt={img.title}
                  />

                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors" />

                  <div className="absolute top-3 right-3 flex gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <button
                      onClick={() => handleEditImage(img)}
                      className="p-3 bg-white/70 hover:bg-emerald-500 text-slate-900 rounded-xl transition-colors shadow-xl cursor-pointer"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      onClick={() => handleDeleteImage(img.id)}
                      className="p-3 bg-white/70 hover:bg-rose-500 text-slate-900 rounded-xl transition-colors shadow-xl cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {img.description && (
                  <div className="p-4 border-t border-slate-200 bg-slate-50">
                    <p className="text-xs text-slate-600 italic line-clamp-2">
                      "{img.description}"
                    </p>
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {albumImages.length === 0 && !showForm && (
        <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-slate-300 rounded-3xl text-slate-700">
          <ImageIcon className="text-slate-400 mb-4" size={48} />
          <p className="font-medium">This album is currently empty.</p>

          <Link
            href="/admin/gallery"
            className="mt-4 text-emerald-600 hover:underline text-sm font-bold cursor-pointer"
          >
            Go back to upload images
          </Link>
        </div>
      )}
    </div>
  );
}