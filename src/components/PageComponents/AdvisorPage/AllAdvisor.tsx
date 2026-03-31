"use client"
import { motion } from 'motion/react';
import { ArrowLeft, Mail, Linkedin, Users as UsersIcon, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { ImagePosition } from '@/components/Hooks/ImagePosition';
import { useTeam } from '@/components/Hooks/useTeam';
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {team.filter((m) => m.memberType === "advisor").map((member, index) => (
              <motion.div
                key={member.slug}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-[#10B981]/10 hover:border-[#10B981]/30 h-full flex flex-col"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
              >

                <div className="relative h-72 overflow-hidden">
                  <ImagePosition
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {member.email && (
  <motion.a
    href={`mailto:${member.email}`}
    className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-[#0F172A] hover:bg-[#10B981] hover:text-white transition-colors duration-300"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
  >
    <Mail className="w-5 h-5" />
  </motion.a>
)}                   
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl text-[#0F172A] mb-1 group-hover:text-[#10B981] transition-colors duration-300">
                    {member.name}
                  </h3>
                  <p className="text-[#10B981] text-sm mb-3">{member.role}</p>
                  
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                    {member.bio}
                  </p>
  
                  <div className="flex flex-col gap-2 mb-4">
                   {member.expertise.split(', ').slice(0, 2).map((skill: string, idx: number) => (
  <span
    key={idx}
    className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
  >
    {skill}
  </span>
))}
                  </div>
                  <div className="mt-auto">
                  <Link href={`/team/${member.slug}`}>
                   <motion.button 
                    className="w-full text-center py-2 text-[#10B981] hover:text-white bg-transparent hover:bg-[#10B981] border border-[#10B981] rounded-lg transition-all duration-300 text-sm cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}>
                    Read Full Bio
                    <span>→</span>
                    </motion.button>
                   </Link>
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
