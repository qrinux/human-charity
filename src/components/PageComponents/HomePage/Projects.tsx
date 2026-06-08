"use client";

import { motion } from "motion/react";
import { ArrowRight, MapPin, Users, Calendar, Loader2 } from "lucide-react";
import Link from "next/link";
import { useProjects } from "@/components/Hooks/useProjects";
import { ImagePosition } from "@/components/Hooks/ImagePosition";
import { ProgressBar } from "@/components/Hooks/ProgressBar";

export function Projects() {
  const { projects, loading } = useProjects();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="animate-spin text-emerald-500" size={50} />
      </div>
    );
  }

  return (
    <section id="projects" className="pt-20 pb-10 bg-gray-50">
      <div className="container mx-auto px-6">

        {/* HEADER */}
        <div className="text-center mb-16">
          <div className="inline-block bg-[#10B981]/10 text-[#10B981] px-4 py-2 rounded-full text-sm mb-4">
            Active Projects
          </div>

          <h2 className="text-4xl lg:text-5xl text-[#0F172A] mb-4">
            Impact In Action
          </h2>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our recent initiatives are transforming communities across Bangladesh.</p>
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {projects.slice(0, 3).map((project) => (
            <motion.div
              key={project.title}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col h-full"
            >

              {/* IMAGE */}
              <div className="relative h-56 overflow-hidden">
                <ImagePosition
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />  
              </div>

              {/* CONTENT */}
              <div className="p-6 flex flex-col flex-1">

                {/* TITLE */}
                <h3 className="text-xl text-[#0F172A] mb-3 group-hover:text-[#10B981] transition-colors">
                  {project.title}
                </h3>

                {/* DESCRIPTION (3 LINES FIXED) */}
                <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3 min-h-[72px]">
                  {project.description}
                </p>

                {/* FIXED INFO ROW */}
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{project.beneficiaries}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{project.timeline}</span>
                  </div>
                </div>

                {/* BOTTOM SECTION */}
                <div className="mt-auto space-y-3">

                  <ProgressBar progress={project.progress} showText />

                  <Link href={`/projects/${project.slug}`}>
                    <motion.button
                      className="w-full flex items-center justify-center gap-2 text-[#10B981] hover:text-[#059669] group-hover:gap-3 transition-all duration-300 pt-2 cursor-pointer"
                      whileHover={{ x: 5 }}
                    >
                      View Details
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </Link>

                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* BUTTON */}
        <div className="text-center mt-12">
          <Link href="/projects">
            <button className="bg-[#0F172A] hover:bg-[#1E293B] text-white px-8 py-4 rounded-full font-semibold transition-all cursor-pointer">
              View All Projects
            </button>
          </Link>
        </div>

      </div>
    </section>
  );
}