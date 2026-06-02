"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { useGallery } from "@/components/Hooks/useGallery";
import {
  Loader2,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  ArrowLeft,
} from "lucide-react";

export default function AlbumPage() {
  const params = useParams();
  const router = useRouter();
  const { items, loading } = useGallery();

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // These are now clean ASCII slugs — no encoding issues!
  const categorySlug = Array.isArray(params.categorySlug)
    ? params.categorySlug[0]
    : params.categorySlug || "";

  const slug = Array.isArray(params.slug)
    ? params.slug[0]
    : params.slug || "";

  // Match by slug fields — safe and reliable
  const albumImages = items.filter(
    (img) => img.categorySlug === categorySlug && img.slug === slug
  );

  const closeLightbox = () => setLightboxIndex(null);
  const nextImage = () =>
    setLightboxIndex((prev) => (prev! + 1) % albumImages.length);
  const prevImage = () =>
    setLightboxIndex((prev) => (prev! - 1 + albumImages.length) % albumImages.length);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-6">
        <Loader2 className="animate-spin text-emerald-500" size={48} />
      </div>
    );
  }

  // Get title/category from first image to display (original Bengali text)
  const albumTitle = albumImages[0]?.title || slug;
  const albumCategory = albumImages[0]?.category || categorySlug;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-32 pb-24">
      <div className="container mx-auto px-6">

        <motion.button
          className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 mb-8 transition-colors duration-300 cursor-pointer group font-semibold"
          whileHover={{ x: -5 }}
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-5 h-5 group-hover:stroke-[3px]" />
          Back to Gallery
        </motion.button>

        {/* Show original Bengali title at top */}
        {albumImages.length > 0 && (
          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
              {albumCategory}
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
              {albumTitle}
            </h1>
            <p className="text-sm text-gray-500 mt-2 text-justify">{albumImages[0]?.description}</p>
          </div>
        )}

        <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 1200: 3 }}>
          <Masonry gutter="20px">
            {albumImages.map((img, idx) => (
              <motion.div
                key={idx}
                className="group relative overflow-hidden rounded-xl cursor-pointer shadow-md hover:shadow-xl transition-all duration-500"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -5 }}
                onClick={() => setLightboxIndex(idx)}
              >
                <img
                  src={img.url}
                  alt={img.title}
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105 group-hover:brightness-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <h3 className="font-semibold text-lg text-white">{img.title}</h3>
                  <p className="text-sm text-white opacity-80 line-clamp-3">{img.description}</p>
                  <div className="flex items-center gap-2 text-xs text-white opacity-70 mt-2">
                    <Calendar size={12} /> {new Date(img.date).toLocaleDateString()}
                  </div>
                </div>
              </motion.div>
            ))}
          </Masonry>
        </ResponsiveMasonry>

        {albumImages.length === 0 && (
          <div className="text-center py-32">
            <p className="text-gray-500 text-lg">No images in this album</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-6"
            onClick={closeLightbox}
          >
            <button
              className="absolute top-6 right-6 text-white hover:text-emerald-400 transition-colors cursor-pointer"
              onClick={closeLightbox}
            >
              <X size={32} />
            </button>

            <button
              className="absolute left-6 text-white hover:text-emerald-400 transition-colors"
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
            >
              <ChevronLeft size={40} />
            </button>

            <button
              className="absolute right-6 text-white hover:text-emerald-400 transition-colors"
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
            >
              <ChevronRight size={40} />
            </button>

            <div
              className="max-w-6xl max-h-[90vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={albumImages[lightboxIndex].url}
                alt={albumImages[lightboxIndex].title}
                className="max-h-[80vh] object-contain rounded-lg shadow-2xl"
              />
              <div className="mt-6 text-center text-white">
                <h3 className="text-2xl font-bold">
                  {albumImages[lightboxIndex].title}
                </h3>
                {/* <p className="text-sm text-white/70 mt-2">
                  {albumImages[lightboxIndex].description}
                </p> */}
                <div className="flex items-center justify-center gap-2 text-sm text-white/50 mt-2">
                  <Calendar size={14} />
                  <span>{new Date(albumImages[lightboxIndex].date).toLocaleDateString()}</span>
                  <span className="mx-2">•</span>
                  <span>{albumImages[lightboxIndex].category}</span>
                </div>
              </div>
            </div>

            <div className="absolute bottom-6 text-white text-sm">
              {lightboxIndex + 1} / {albumImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}