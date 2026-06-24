"use client";

import { motion } from 'motion/react';
import { ArrowLeft, Mail, Linkedin, Award, GraduationCap, Briefcase, Loader2 } from 'lucide-react';
import { Facebook, Twitter, Instagram } from 'lucide-react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useTeam } from '@/components/Hooks/useTeam';

export function TeamDetails() {
  const params = useParams();
  const slug = params.slug as string;

  const { member, loading } = useTeam(slug);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <Loader2 className="animate-spin text-emerald-500" size={40} />
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-6 py-32 text-center">
          <h1 className="text-4xl text-[#0F172A] mb-4">Team Member Not Found</h1>
          <Link href="/" className="text-[#10B981] hover:text-[#059669] cursor-pointer">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }
  const socials = [
    { icon: Mail, label: "Email", url: `mailto:${member.email}`, visible: !!member.email, bg: "bg-[#10B981]", hover: "hover:bg-[#059669]", text: "text-white" },
    { icon: Linkedin, label: "LinkedIn", url: member.linkedin, visible: !!member.linkedin, bg: "bg-gray-100", hover: "hover:bg-gray-200", text: "text-[#0F172A]" },
    { icon: Facebook, label: "Facebook", url: member.facebook, visible: !!member.facebook, bg: "bg-blue-600", hover: "hover:bg-blue-700", text: "text-white" },
    { icon: Twitter, label: "Twitter", url: member.twitter, visible: !!member.twitter, bg: "bg-blue-400", hover: "hover:bg-blue-500", text: "text-white" },
    { icon: Instagram, label: "Instagram", url: member.instagram, visible: !!member.instagram, bg: "bg-pink-500", hover: "hover:bg-pink-600", text: "text-white" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="pt-32 pb-24">
        <div className="container mx-auto px-6">
          <Link href="/team">
            <motion.button
              className="flex items-center gap-2 text-gray-600 hover:text-[#10B981] mb-8 transition-colors duration-300 cursor-pointer"
              whileHover={{ x: -5 }}
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </motion.button>
          </Link>

<div className="max-w-7xl mx-auto">
  <div className="grid lg:grid-cols-12 gap-10">

    {/* Left Image */}
    <motion.div
      className="lg:col-span-4"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="sticky top-32">
        <div className="overflow-hidden rounded-3xl">
          <img
            src={member.image}
            alt={member.name}
            className="w-full h-[450px] object-cover"
          />
        </div>
      </div>
    </motion.div>

    {/* Right Content */}
    <motion.div
      className="lg:col-span-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="border-b border-gray-200 pb-8 mb-10">
        <span className="inline-block text-[#10B981] text-sm tracking-[0.2em] uppercase mb-4">
          Team Member
        </span>

        <h1 className="text-4xl md:text-6xl font-light text-[#0F172A] leading-tight">
          {member.name}
        </h1>

        <p className="text-xl text-gray-600 mt-4">
          {member.role}
        </p>

        {/* Socials */}
        <div className="flex flex-wrap gap-3 mt-8">
          {socials
            .filter((s) => s.visible)
            .map((s, i) => (
              <motion.a
                key={i}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -3 }}
                className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-[#0F172A] hover:border-[#10B981] hover:text-[#10B981] transition-all duration-300"
              >
                <s.icon className="w-5 h-5" />
              </motion.a>
            ))}
        </div>
      </div>

      {/* Bio Content */}
      <div className="max-w-4xl">
        {member.bio.split("\n\n").map(
          (paragraph: string, index: number) => (
            <p
              key={index}
              className="text-gray-700 text-lg leading-[2] mb-8"
            >
              {paragraph}
            </p>
          )
        )}
      </div>
    </motion.div>
  </div>
</div>
        </div>
      </div>
    </div>
  );
}