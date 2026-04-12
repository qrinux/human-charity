"use client";

import { motion } from "motion/react";
import { ArrowRight, Heart, Loader2, X } from "lucide-react";
import { ImagePosition } from "@/components/Hooks/ImagePosition";
import { useHero } from "@/components/Hooks/useHero";
import Link from "next/link";
import { useState } from "react";

export function Hero() {
  const { hero, loading } = useHero();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (loading || !hero) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <Loader2 className="animate-spin text-emerald-500" size={50} />
      </div>
    );
  }

  const {
    badgeText,
    headline,
    description,
    livesImpacted,
    projectsCount,
    yearsActive,
    images,
    donateLink,
  } = hero;

  return (
    <section
      id="hero"
      className="relative min-h-screen bg-gradient-to-b from-[#f0fdf4] to-[#ffffff] pt-20  overflow-hidden"
    >
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* LEFT SIDE */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div className="inline-flex items-center gap-2 bg-[#10B981]/10 border border-[#10B981]/30 px-4 py-2 rounded-full mb-6">
              <Heart className="w-4 h-4 text-[#10B981]" fill="#10B981" />
              <span className="text-[#10B981] text-sm">{badgeText}</span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6 text-green-950">
              {headline}
            </h1>

            <p className="text-slate-600 text-lg mb-8 max-w-lg">
              {description}
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href={donateLink}
                className="bg-[#F59E0B] hover:bg-[#D97706] text-white px-8 py-4 rounded-full font-semibold flex items-center gap-2"
              >
                Donate Now
                <Heart className="w-5 h-5" fill="white" />
              </Link>

              <button
                onClick={() => scrollToSection("projects")}
                className="bg-white hover:bg-green-50 border border-green-200 text-green-700  px-8 py-4 rounded-full font-semibold flex items-center gap-2 cursor-pointer transition-colors"
              >
                Our Work
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/10">
              <div>
                <div className="text-3xl font-bold text-green-600">{livesImpacted}</div>
                <div className="text-slate-500 text-sm">Lives Impacted</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">{projectsCount}</div>
                <div className="text-slate-500 text-sm">Projects</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">{yearsActive}</div>
                <div className="text-slate-500 text-sm">Years Active</div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT SIDE IMAGES */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="grid grid-cols-6 grid-rows-6 gap-3 h-[600px]">
              {images.map((img: string, i: number) => (
                <div
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`rounded-2xl overflow-hidden cursor-pointer ${
                    i === 0
                      ? "col-span-4 row-span-4"
                      : i === 1 || i === 2
                      ? "col-span-2 row-span-3"
                      : "col-span-2 row-span-2"
                  }`}
                >
                  <ImagePosition
                    src={img}
                    alt={`Hero Image ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* FULL IMAGE MODAL */}
     {selectedImage && (
  <div
    className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50"
    onClick={() => setSelectedImage(null)}
  >
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="relative max-w-[90%] max-h-[90%]"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close Button (INSIDE IMAGE TOP RIGHT) */}
      <button
        onClick={() => setSelectedImage(null)}
        className="absolute top-3 right-3 z-10 bg-red-600 hover:bg-red-600/80 text-white p-2 rounded-full backdrop-blur-md transition cursor-pointer"
      >
        <X size={20} />
      </button>

      <img
        src={selectedImage}
        alt="Selected"
        className="rounded-2xl shadow-2xl max-w-full max-h-[90vh] object-contain"
      />
    </motion.div>
  </div>
)}
    </section>
  );
}