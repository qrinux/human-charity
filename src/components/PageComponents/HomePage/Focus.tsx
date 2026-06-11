"use client";

import { motion } from "motion/react";
import {
  Heart,
  GraduationCap,
  HandHeart,
  Users,
  Globe,
  HouseIcon,
} from "lucide-react";

const pillars = [
  {
    icon: Heart,
    title: "Youth Leadership",
    subtitle: "Empowering the next generation of changemakers",
  },
  {
    icon: Users,
    title: "Women's Empowerment",
    subtitle: "Creating opportunities for dignity and independence",
  },
  {
    icon: GraduationCap,
    title: "Education Access",
    subtitle: "Opening doors through learning and digital inclusion",
  },
  {
    icon: HandHeart,
    title: "Community Health",
    subtitle: "Ensuring care reaches every person in need",
  },
  {
    icon: Globe,
    title: "Climate Action",
    subtitle: "Building a sustainable and environmentally conscious future",
  },
  {
    icon: HouseIcon,
    title: "Civic Engagement",
    subtitle:
      "Encouraging awareness, participation, and social responsibility",
  },
];

export function Focus() {
  return (
    <section
      id="focus"
      className="mb-24 bg-white"
    >
      {/* Synchronized container matching ImpactStory and Contact layout */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-12">
        
        {/* Header Layout */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-20">
          <div>
            <span className="inline-flex items-center gap-2 text-[#10B981] text-xs font-semibold tracking-widest uppercase mb-3">
              <span className="w-6 h-px bg-[#10B981]" />
              Our Focus Areas
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold text-[#0F172A] leading-tight">
              Building Change<br />
              <span className="text-[#10B981]">Through Purpose</span>
            </h2>
          </div>
          <p className="text-gray-500 text-[14px] leading-relaxed max-w-sm lg:text-right">
            Six strategic pillars guiding our mission to create sustainable impact, stronger communities, and a better future for everyone.
          </p>
        </div>

        {/* Focus Pillar Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
          {pillars.map((pillar, index) => {
            // Checks if the item belongs to the last row on mobile or desktop layout states
            const isAbsoluteLast = index === pillars.length - 1;
            const isLastTwoRow = index >= pillars.length - 2;

            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                }}
                className={`
                  group
                  flex
                  items-start
                  gap-6
                  pb-8
                  transition-all
                  duration-500
                  ${isAbsoluteLast ? "border-b-0" : "border-b border-gray-200"}
                  ${isLastTwoRow ? "md:border-b-0 md:pb-0" : "hover:border-[#10B981]/50"}
                `}
              >
                {/* Number Layout */}
                <div className="text-5xl font-bold text-gray-200 min-w-[70px]">
                  {String(index + 1).padStart(2, "0")}
                </div>

                {/* Pillar Meta Content */}
                <div className="flex-1">
                  <h3 className="text-xl lg:text-2xl font-semibold text-[#0F172A] group-hover:text-[#10B981] transition-colors">
                    {pillar.title}
                  </h3>

                  <p className="mt-2 text-gray-500 leading-relaxed text-[14px]">
                    {pillar.subtitle}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}