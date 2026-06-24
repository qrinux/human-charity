"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import {
  ArrowLeft,
  MapPin,
  Users,
  Calendar,
  CheckCircle,
  Loader2,
  Share2,
  Facebook,
  Linkedin,
  Twitter,
  MessageCircle,
  Instagram,
  X,
} from "lucide-react";
import Link from "next/link";
import { ImagePosition } from "@/components/Hooks/ImagePosition";
import { useProjects } from "@/components/Hooks/useProjects";

import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";

export function ProjectDetails() {
  const { slug } = useParams();
  const { project, loading } = useProjects(slug as string);

  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <Loader2 className="animate-spin text-emerald-500" size={40} />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-6 py-32 text-center">
          <h1 className="text-4xl text-[#0F172A] mb-4">Project Not Found</h1>
          <Link
            href={"/"}
            className="text-[#10B981] hover:text-[#059669] cursor-pointer"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="pt-32 pb-24">
        <div className="container mx-auto px-6">
          <Link href={"/"}>
            <motion.button
              className="flex items-center gap-2 text-gray-600 hover:text-[#10B981] mb-8 transition-colors duration-300 cursor-pointer"
              whileHover={{ x: -5 }}
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </motion.button>
          </Link>

          <motion.div
            className="rounded-3xl overflow-hidden shadow-2xl mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ImagePosition
              src={project.image}
              alt={project.title}
              className="w-full h-[450px] object-top"
            />
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h1 className="text-5xl text-[#0F172A] mb-6">{project.title}</h1>

                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
                    <MapPin className="w-4 h-4 text-[#10B981]" />
                    <span className="text-sm text-black">{project.location}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
                    <Users className="w-4 h-4 text-[#10B981]" />
                    <span className="text-sm text-black">
                      {project.beneficiaries} Beneficiaries
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
                    <Calendar className="w-4 h-4 text-[#10B981]" />
                    <span className="text-sm text-black">{project.timeline}</span>
                  </div>
                </div>

                <p className="text-xl text-gray-700 leading-relaxed mb-12">
                  {project.fullDescription}
                </p>

                {/* Project objectives */}
                <div className="mb-12">
                  <h2 className="text-3xl text-[#0F172A] mb-6">Project Objectives</h2>
                  <div className="space-y-3">
                    {project.objectives.map((objective: string, index: number) => (
                      <motion.div
                        key={index}
                        className="flex items-start gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                      >
                        <CheckCircle className="w-6 h-6 text-[#10B981] flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{objective}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Impact section */}
                <div className="bg-gradient-to-br from-[#10B981]/10 to-[#059669]/10 rounded-2xl p-8">
                  <h2 className="text-3xl text-[#0F172A] mb-6">Impact Achieved</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {project.impact.map((item: string, index: number) => (
                      <motion.div
                        key={index}
                        className="flex items-start gap-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        <div className="w-8 h-8 bg-[#10B981] rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-sm">✓</span>
                        </div>
                        <span className="text-gray-700">{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            
            <div className="lg:col-span-1">
              <motion.div
                className="sticky top-32"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                
                <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-[#10B981]/20 mb-6">
                  <h3 className="text-xl text-[#0F172A] mb-4">Project Progress</h3>
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Completion</span>
                      <span className="text-2xl text-[#10B981]">{project.progress}%</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#10B981] to-[#059669] rounded-full"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                  <Link href="/#contact">
                    <motion.button
                      className="w-full bg-[#F59E0B] hover:bg-[#D97706] text-white py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Support This Project
                    </motion.button>
                  </Link>
                </div>

                {/* Share Section */}
                <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-2xl p-8 text-white">
                  <h3 className="text-xl mb-4">Share This Project</h3>
                  <p className="text-white/70 text-sm mb-6">
                    Help us reach more supporters by sharing this project
                  </p>
                  <button
                    onClick={() => setShowShare(true)}
                    className="bg-white/10 cursor-pointer hover:bg-white/20 text-white px-8 py-4 rounded-full font-bold backdrop-blur-sm transition-all flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-5 h-5" /> Share Project
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    
{showShare && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
    <div className="bg-slate-900 rounded-2xl p-6 w-[90%] max-w-sm relative flex flex-col items-center gap-6">
      <button
        onClick={() => setShowShare(false)}
        className="absolute top-4 bg-red-600 p-2 rounded-full right-4 text-white hover:bg-red-400 cursor-pointer"
      >
        <X />
      </button>

      <h2 className="text-xl  text-white/80 flex items-center justify-center gap-2 font-bold mb-2 text-center">
        <Share2 className="w-5 h-5"/>  Share
      </h2>
      <div className="flex items-center justify-center gap-4">
        <FacebookShareButton url={shareUrl}>
          <div className="p-4 bg-blue-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
            <Facebook size={24} color="white" />
          </div>
        </FacebookShareButton>

        <TwitterShareButton url={shareUrl} title={project.title}>
          <div className="p-4 bg-black rounded-full flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
            <Twitter size={24} color="white" />
          </div>
        </TwitterShareButton>

        <LinkedinShareButton url={shareUrl} title={project.title}>
          <div className="p-4 bg-[#10B981] rounded-full flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
            <Linkedin size={24} color="white" />
          </div>
        </LinkedinShareButton>

        <WhatsappShareButton url={shareUrl}>
          <div className="p-4 bg-green-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
            <MessageCircle size={24} color="white" />
          </div>
        </WhatsappShareButton>

        <button
          onClick={() => {
            if (typeof window !== "undefined") {
              navigator.clipboard.writeText(window.location.href);
              setCopied(true);
              window.open("https://www.instagram.com/", "_blank");
              setTimeout(() => setCopied(false), 4000);
            }
          }}
          className="p-4 bg-pink-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
        >
          <Instagram size={24} color="white"/>
        </button>
      </div>

      <button
        onClick={() => {
          if (typeof window !== "undefined") {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 4000);
          }
        }}
        className="mt-4 w-full bg-gray-600 hover:bg-gray-500 p-3 rounded-lg font-medium transition-colors cursor-pointer"
      >
        {copied ? "Copied!" : "Copy Link"}
      </button>
    </div>
  </div>
)}
    </div>
  );
}