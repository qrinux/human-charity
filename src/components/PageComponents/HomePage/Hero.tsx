"use client";

import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Heart, Loader2 } from "lucide-react";
import { useHero } from "@/components/Hooks/useHero";
import { useEffect, useState } from "react";

export function Hero() {
  const { hero, loading } = useHero();
  const [currentIndex, setCurrentIndex] = useState(0);

 useEffect(() => {
    if (!hero?.images?.length) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === hero.images.length - 1 ? 0 : prev + 1
      );
    }, 6000);

    return () => clearInterval(interval);
  }, [hero]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (loading || !hero) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="w-12 h-12 animate-spin text-[#10B981]" />
      </div>
    );
  }

  const { badgeText, headline, description, images } = hero;

  return (
    <section className="relative min-h-screen mb-24 overflow-hidden bg-black">

      {/* BACKGROUND SLIDER */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 bg-cover bg-center lg:bg-right"
          style={{
            backgroundImage: `url(${images[currentIndex]})`,
          }}
        />
      </AnimatePresence>

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/55" />

      {/* CONTENT container matched perfectly to ImpactStory layout structures */}
      <div className="relative z-10 min-h-screen flex items-center w-full">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full pt-12">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="w-full max-w-3xl"
          >
            {/* Dynamic Badge Component tracking page hierarchy */}
            {badgeText && (
              <span className="inline-flex items-center gap-2 text-[#10B981] text-sm font-semibold tracking-widest uppercase mb-4">
                <span className="w-6 h-px bg-[#10B981]" />
                {badgeText}
              </span>
            )} 

            <h1
              className="
                text-white
                text-4xl
                sm:text-5xl
                lg:text-7xl
                font-bold
                leading-[1.15]
                mb-6
                tracking-tight
              "
            >
              {headline}
            </h1>

            {/* DESCRIPTION (SOFTER) */}
            <p
              className="
                text-white/80
                text-base
                sm:text-lg
                lg:text-xl
                leading-relaxed
                max-w-xl
                mb-10
              "
            >
              {description}
            </p>

            {/* CTA Buttons matched to full interface design systems */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => scrollToSection("contact")}
                className="
                  w-full sm:w-auto
                  bg-[#10B981]
                  hover:bg-[#059669]
                  text-white
                  px-8 py-3.5
                  rounded-xl
                  font-semibold
                  text-lg
                  inline-flex
                  items-center
                  justify-center
                  gap-2.5 cursor-pointer
                  shadow-md hover:shadow-lg
                  transition-all duration-200
                "
              >
                Donate Now
                <Heart size={16} fill="currentColor" />
              </button>

              <button
                onClick={() => scrollToSection("projects")}
                className="
                  w-full sm:w-auto
                  border border-white/80
                  text-white
                  hover:bg-white
                  hover:text-black
                  px-8 py-3.5
                  rounded-xl
                  font-semibold
                  text-lg
                  inline-flex
                  items-center
                  justify-center
                  gap-2.5 cursor-pointer
                  transition-all duration-200
                "
              >
                Explore Our Work
                <ArrowRight size={16} />
              </button>
            </div>

          </motion.div>
        </div>
      </div>

      {/* SLIDER DOT INDEX METERS */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {images.map((_: string, index: number) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`
              h-2.5 rounded-full transition-all duration-300 cursor-pointer
              ${index === currentIndex
                ? "bg-white w-6"
                : "bg-white/40 w-2.5 hover:bg-white/70"
              }
            `}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* BOTTOM BASE GRADIENT TRANSITION */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
    </section>
  );
}