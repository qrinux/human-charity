"use client"
import { motion } from 'motion/react';
import { Heart, GraduationCap, HandHeart, Users,Globe,HouseIcon } from 'lucide-react';

const pillars = [
  {
    icon: Heart,
    title: 'Youth Leadership & Skills',
    description: "Young people are not just the future — they are the present. Through hands-on workshops, startup seminars, and mentorship-driven initiatives, we build entrepreneurial skills, leadership capacity, and civic responsibility in Sylhet's youth. A skilled young person is a nation's most powerful resource.",
    color: '#10B981',
  },
  {
    icon: Users,
    title: "Women's Empowerment",
    description: 'Human Care dismantles the structural barriers that hold women back. We provide vocational training, education access, and safe spaces addressing gender-based violence, mental health, and menstrual wellbeing — creating economically independent women who lead families, businesses, and communities with dignity.',
    color: '#10B981',
  },
  {
    icon: GraduationCap,
    title: 'Education & Digital Access',
    description: 'Education unlocks everything else. We support schools, train teachers, and deliver digital tools to children in marginalised communities. By combining literacy programmes with technology access, we prepare children for a world that demands both critical thinking and digital fluency.',
    color: '#10B981',
  },
  {
    icon: HandHeart,
    title: 'Community Health',
    description: 'Good health is the foundation of everything we build. From awareness campaigns to on-ground medical support, Human Care ensures no one is left behind due to geography, income, or lack of information. A community that is healthy is a community that can truly thrive.',
    color: '#10B981',
  },
  
  {
    icon: Globe,
    title: "Climate Action",
    description: 'Bangladesh is among the nations most vulnerable to climate change. Human Care channels youth energy into real environmental action — combating local pollution, raising climate awareness, and cultivating an eco-conscious generation equipped and motivated to confront the crisis head-on.',
    color: '#10B981',
  },
  {
    icon: HouseIcon,
    title: "Civic Empowerment",
    description: 'riving democracy needs engaged citizens. We educate young people on their civic rights and responsibilities, fostering transparency and accountability at every level of governance. Change starts with awareness. It grows with action — and Human Care provides both.',
    color: '#10B981',
  },
];

export function Focus() {
  return (
    <section id="focus" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-80 bg-[#10B981]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#F59E0B]/5 rounded-full blur-3xl"></div>

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
            Our Focus Areas
          </motion.div>
          <h2 className="text-4xl lg:text-5xl text-[#0F172A] mb-4">
            Six Pillars of Change
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transforming lives through comprehensive programs designed to address the most critical needs of our communities
          </p>
        </motion.div>

        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              className="group relative bg-white rounded-2xl p-8 border-2 border-[#10B981]/20 hover:border-[#10B981] transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
        
              <motion.div
                className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                whileHover={{ rotate: 5 }}
              >
                <pillar.icon className="w-8 h-8 text-white" />
              </motion.div>

              <h3 className="text-2xl text-[#0F172A] mb-3">
                {pillar.title}
              </h3>

              <p className="text-gray-600 leading-relaxed mb-6">
                {pillar.description}
              </p>

              <div className="h-1 w-0 bg-gradient-to-r from-[#10B981] to-[#059669] group-hover:w-full transition-all duration-500 rounded-full"></div>

              <div className="absolute inset-0 bg-gradient-to-br from-[#10B981]/0 to-[#10B981]/0 group-hover:from-[#10B981]/5 group-hover:to-[#059669]/5 rounded-2xl transition-all duration-300 pointer-events-none"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
