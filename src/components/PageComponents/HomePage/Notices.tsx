"use client";

import { motion } from "motion/react";
import Image from "next/image";

export function Notices() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <section className="mb-24 relative overflow-hidden h-[500px] lg:h-[580px] w-full left-0 right-0">

      {/* Full-width Viewport Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/carevalue.jpg"
          alt="Human Care volunteers helping community members"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content Container locked to your precise layout boundary widths */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-center lg:justify-end">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-[480px] text-center lg:text-left flex flex-col items-center lg:items-start"
        >
          {/* Tagline Badge */}
          <span className="inline-flex items-center gap-2 text-[#10B981] text-xs font-semibold tracking-widest uppercase mb-4">
            <span className="w-6 h-px bg-[#10B981]" />
            Human Care
          </span>

          <h2 className="text-white text-3xl sm:text-4xl font-bold leading-[1.2] mb-5 tracking-tight">
            Together, We Care.<br />
            Together, We Change Lives.
          </h2>

          <p className="text-white/80 text-sm sm:text-base font-normal leading-relaxed mb-8 max-w-md">
            Support a life. Change a future. Join us in building communities
            with dignity and hope across Bangladesh.
          </p>

          {/* Premium Button */}
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
              text-sm 
              transition-all duration-200 
              shadow-md hover:shadow-lg
              cursor-pointer
            "
          >
            Join Our Mission
          </button>
        </motion.div>
      </div>

    </section>
  );
}