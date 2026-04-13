"use client"
import { motion } from 'motion/react';
import { Linkedin, Loader2, Mail } from 'lucide-react';
import { ImagePosition } from '@/components/Hooks/ImagePosition';
import Link from 'next/link';
import { useTeam } from '@/components/Hooks/useTeam';
import { UseTeamCard } from '@/components/Hooks/UseTeamCard';

export function Advisor() {
  const {team,loading}=useTeam()
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <Loader2 className="animate-spin text-emerald-500" size={50} />
      </div>
    );
  }
  return (
    <section id="advisor" className=" pt-12 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#10B981]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-[#F59E0B]/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-block bg-[#10B981]/10 text-[#10B981] px-4 py-2 rounded-full text-sm mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            Our Advisor
          </motion.div>
          <h2 className="text-4xl lg:text-5xl text-[#0F172A] mb-4">
            Meet the People Behind Our Mission
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Dedicated professionals united by a common goal: creating positive change in Bangladesh
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4  lg:grid-cols-6 gap-5 mb-16">
          {team.filter((m) => m.memberType === "advisor").slice(0,6).map((member, index) => (
             <UseTeamCard key={member.name} member={member} index={index} />
          ))}
        </div>
        <motion.div
          className="text-center my-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <Link href="/advisor">
            <motion.button
              className="bg-[#0F172A] cursor-pointer hover:bg-[#1E293B] text-white px-8 py-4 rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View All Our Advisor
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
