"use client"
import { motion } from 'motion/react';
import { ArrowLeft, Mail, Linkedin, Users as UsersIcon, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { ImagePosition } from '@/components/Hooks/ImagePosition';
import { useTeam } from '@/components/Hooks/useTeam';
import { UseTeamCard } from '@/components/Hooks/UseTeamCard';
export function AllAdvisor() {
  const {team,loading}=useTeam()
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
              <Loader2 className="animate-spin text-emerald-500" size={40} />
            </div>
    );
  }
  return (
    <div className="min-h-screen bg-white"> 
      <div className="pt-32 pb-24">
        <div className="container mx-auto px-6">
          <Link href="/">
            <motion.button
              className="flex cursor-pointer items-center gap-2 text-gray-600 hover:text-[#10B981] mb-8 transition-colors duration-300"
              whileHover={{ x: -5 }}
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </motion.button>
          </Link>
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 bg-[#10B981]/10 text-[#10B981] px-4 py-2 rounded-full text-sm mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <UsersIcon className="w-4 h-4" />
              Our Advisor
            </motion.div>
            <h1 className="text-5xl text-[#0F172A] mb-4">
              Meet with all our advisor
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Dedicated professionals working together to create lasting change across Bangladesh
            </p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6  gap-5">
            {team.filter((m) => m.memberType === "advisor").map((member, index) => (
             <UseTeamCard key={member.name} member={member} index={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
