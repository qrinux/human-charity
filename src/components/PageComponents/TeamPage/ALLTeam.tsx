"use client"
import { motion } from 'motion/react';
import { ArrowLeft, Mail, Linkedin, Users as UsersIcon, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { ImagePosition } from '@/components/Hooks/ImagePosition';
import { useTeam } from '@/components/Hooks/useTeam';
import { UseTeamCard } from '@/components/Hooks/UseTeamCard';
export function AllTeam() {
  const { team, loading } = useTeam()
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
              Our Team
            </motion.div>
            <h1 className="text-5xl text-[#0F172A] mb-4">
              Meet Our Team
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Dedicated professionals working together to create lasting change across Bangladesh
            </p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
            {team.filter((m) => m.memberType === "member").map((member, index) => (
             <UseTeamCard key={member.name} member={member} index={index} />
            ))}
          </div>

          <motion.div
            className="mt-16 text-center bg-gradient-to-r from-[#0F172A] to-[#1E293B] rounded-2xl p-12 text-white max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <UsersIcon className="w-12 h-12 mx-auto mb-4 text-[#10B981]" />
            <h3 className="text-3xl mb-4">Join Our Team</h3>
            <p className="text-white/70 mb-8 max-w-xl mx-auto text-lg">
              We're always looking for passionate individuals who want to make a difference.
              Explore career opportunities and volunteer positions with Human Care.
            </p>
            <div className="flex justify-center">
              <Link href="/#contact">
                <motion.button
                  className="bg-[#F59E0B] hover:bg-[#D97706] px-8 py-4 rounded-full font-semibold transition-colors duration-300 cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Become a Volunteer
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
