"use client";

import { motion } from "motion/react";
import { Mail } from "lucide-react";
import Link from "next/link";
import { ImagePosition } from "@/components/Hooks/ImagePosition";

interface TeamCardProps {
  member: any;
  index?: number;
}

export function UseTeamCard({ member, index = 0 }: TeamCardProps) {
  return (
    <motion.div
      className="group relative h-full"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-full flex flex-col">

        {/* IMAGE */}
        <div className="relative aspect-[3/4] overflow-hidden shrink-0">
          <ImagePosition
            src={member.image}
            alt={member.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />

          {/* overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* actions */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
            {member.email && (
              <motion.a
                href={`mailto:${member.email}`}
                className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-[#0F172A] hover:bg-[#10B981] hover:text-white transition-colors duration-300 cursor-pointer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Mail className="w-5 h-5" />
              </motion.a>
            )}
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-4 flex-1 flex flex-col">
  <h3 className="text-base md:text-lg font-semibold text-[#0F172A] leading-tight mb-1">
    {member.name}
  </h3>

  <p className="text-[#10B981] text-xs md:text-sm mb-2">
    {member.role}
  </p>

  <p className="text-gray-600 text-xs md:text-sm leading-relaxed mb-3 line-clamp-2">
    {member.bio}
  </p>

  <div className="mt-auto">
    <Link href={`/team/${member.slug}`}>
      <motion.button
        className="text-[#10B981] hover:text-[#059669] text-xs md:text-sm flex items-center gap-1.5 group-hover:gap-2 transition-all duration-300 cursor-pointer"
        whileHover={{ x: 4 }}
      >
        Read Full Bio
        <span>→</span>
      </motion.button>
    </Link>
  </div>
</div>
        {/* top line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#10B981] to-[#059669] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
      </div>
    </motion.div>
  );
}