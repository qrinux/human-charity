"use client"
import { motion } from 'motion/react';
import { Linkedin, Loader2, Mail } from 'lucide-react';
import { ImagePosition } from '@/components/Hooks/ImagePosition';
import Link from 'next/link';
import { useTeam } from '@/components/Hooks/useTeam';

export function Team() {
  const {team,loading}=useTeam()
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <Loader2 className="animate-spin text-emerald-500" size={50} />
      </div>
    );
  }
  return (
    <section id="team" className="pt-12 pb-24 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
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
            Our Team
          </motion.div>
          <h2 className="text-4xl lg:text-5xl text-[#0F172A] mb-4">
            Meet with our contributing member
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Dedicated professionals united by a common goal: creating positive change in Bangladesh
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {team.filter((m) => m.memberType === "member").slice(0,4).map((member, index) => (
            <motion.div
              key={member.name}
              className="group relative h-full"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-full flex flex-col">

                <div className="relative h-80 overflow-hidden shrink-0">
                  <ImagePosition
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 "
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
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
                  <h3 className="text-xl text-[#0F172A] mb-1">
                    {member.name}
                  </h3>
                  <p className="text-[#10B981] mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                    {member.bio}
                  </p>
                  <div className="mt-auto">
                  <Link href={`/team/${member.slug}`}>
                   <motion.button 
                    className="text-[#10B981] hover:text-[#059669] text-sm flex items-center gap-2 group-hover:gap-3 transition-all duration-300 cursor-pointer"
                    whileHover={{ x: 5 }}>
                    Read Full Bio
                    <span>→</span>
                    </motion.button>
                   </Link>
                   </div>
                </div>
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#10B981] to-[#059669] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </div>
            </motion.div>
          ))}
        </div>
        <motion.div
          className="text-center my-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <Link href="/team">
            <motion.button
              className="bg-[#0F172A] cursor-pointer hover:bg-[#1E293B] text-white px-8 py-4 rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View All Team Members
            </motion.button>
          </Link>
        </motion.div>
    
        <motion.div
          className="text-center bg-gradient-to-r from-[#10B981] to-[#059669] rounded-2xl p-12 text-white"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-3xl mb-4">Join Our Team</h3>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto text-lg">
            We're always looking for passionate individuals who want to make a real difference. Explore career opportunities and become part of our mission.
          </p>
          <motion.button
          onClick={() => {
              const element = document.getElementById('contact');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-white text-[#10B981] hover:bg-gray-100 px-8 py-4 rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Become a Member
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
