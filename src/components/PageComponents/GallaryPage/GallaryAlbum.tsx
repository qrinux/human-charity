"use client";

import React, { useState, useMemo } from "react";
import { Image as ImageIcon, Loader2, FolderOpen, ChevronRight } from "lucide-react";
import Link from "next/link";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { useGallery } from "@/components/Hooks/useGallery";
import { motion } from 'motion/react';
interface Album {
  title: string;
  category: string;
  images: { url: string }[];
}

export default function GalleryPage() {
  const { items, loading } = useGallery();
  const [selectedCategory, setSelectedCategory] = useState("all");

  const galleryCategories = useMemo(() => {
  const unique = Array.from(
    new Set(items.map((item: any) => item.category).filter(Boolean))
  );

  return [
    { id: "all", name: "All Projects" },
    ...unique.map((cat) => ({
      id: cat,
      name: cat.charAt(0).toUpperCase() + cat.slice(1),
    })),
  ];
}, [items]);
  const groupedAlbums = useMemo(() => {
    const groups = items.reduce((acc: Record<string, Album>, img: any) => {
      const key = `${img.category}-${img.title}`;
      if (!acc[key]) acc[key] = { title: img.title, category: img.category, images: [] };
      acc[key].images.push(img);
      return acc;
    }, {});
    return Object.values(groups) as Album[];
  }, [items]);

  const filteredAlbums = useMemo(
    () =>
      selectedCategory === "all"
        ? groupedAlbums
        : groupedAlbums.filter((album) => album.category === selectedCategory),
    [groupedAlbums, selectedCategory]
  );

  if (loading) {
    return (
       <div className="flex flex-col justify-center items-center h-screen gap-6">
              <Loader2 className="animate-spin text-emerald-500" size={48} />
            </div>
    );
  }

  return (
    // Background changed to pure white
    <div className="min-h-screen bg-white pt-24 pb-24">
      <div className="container mx-auto px-6 pt-14">
        
        {/* Simplified Header */}
        <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.div
              className="inline-block bg-[#10B981]/10 text-[#10B981] px-4 py-2 rounded-full text-sm mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
             Our Albums
            </motion.div>
            <h1 className="text-5xl text-[#0F172A] mb-4">
              Snapshots of Our Work
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
             Explore the projects and initiatives that are shaping our community and creating real impact.
            </p>
          </motion.div>

        {/* Minimalist Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {galleryCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2 rounded-full font-medium cursor-pointer transition-all duration-300 text-sm ${
                selectedCategory === cat.id
                  ? "bg-emerald-600 text-white shadow-md"
                  : "bg-white text-slate-600 hover:text-emerald-600 border border-slate-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 1024: 3, 1280: 4 }}>
          <Masonry gutter="24px">
            {filteredAlbums.map((album, idx) => (
              <Link
                key={idx}
                href={`/gallery/${album.category}/${encodeURIComponent(album.title)}`}
                className="group"
              >
                {/* Folder/Card Design Maintained */}
                <div className="relative bg-slate-900 rounded-2xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-500">
                  
                  {/* Image Container */}
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img
                      src={album.images[0]?.url}
                      alt={album.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Glass Badge */}
                    <div className="absolute top-4 right-4 backdrop-blur-md bg-black/30 border border-white/20 text-white text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                      <ImageIcon size={14} className="text-emerald-400" />
                      {album.images.length}
                    </div>

                    {/* Gradient for Text Contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />
                  </div>

                  {/* Album info inside the card */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-400">
                      {album.category}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-1 leading-tight group-hover:text-emerald-50">
                      {album.title}
                    </h3>
                    <div className="flex items-center mt-3 text-white/60 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                      Open Folder <ChevronRight size={14} className="ml-1" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </Masonry>
        </ResponsiveMasonry>

        {/* Empty State on White */}
        {filteredAlbums.length === 0 && (
          <div className="text-center py-24">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 mb-4">
               <FolderOpen className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800">No albums found</h3>
            <p className="text-slate-500">Try selecting a different project category.</p>
          </div>
        )}
      </div>
    </div>
  );
}