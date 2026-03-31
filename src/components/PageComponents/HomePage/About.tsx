"use client"
import { motion } from 'motion/react';
import { Target, Award, Users, TrendingUp, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface CounterProps {
  end?: number;
  duration?: number;
  suffix?: string;
}

const CounterAnimation = ({ end = 100, duration = 2000, suffix = "" }: CounterProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let frameId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const runtime = timestamp - startTime;
      const progress = Math.min(runtime / duration, 1);

      setCount(Math.floor(end * progress));

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameId);
  }, [end, duration]);

  return (
    <div>
      {count}
      {suffix}
    </div>
  );
};
const timeline = [
  {
    year: '2010',
    title: 'Foundation',
    description: 'Started with a small team providing medical care in rural Dhaka',
  },
  {
    year: '2013',
    title: 'Expansion',
    description: 'Launched education programs, opened first 3 schools',
  },
  {
    year: '2016',
    title: 'Recognition',
    description: 'Received National NGO Excellence Award',
  },
  {
    year: '2019',
    title: 'Growth',
    description: 'Expanded to 8 districts, served 20,000+ beneficiaries',
  },
  {
    year: '2022',
    title: 'Innovation',
    description: 'Introduced mobile health clinics and digital education',
  },
  {
    year: '2026',
    title: 'Impact',
    description: 'Now serving 50,000+ people annually across Bangladesh',
  },
];

const metrics = [
  {
    icon: Users,
    value: 95,
    suffix: '%',
    label: 'Funds to Programs',
    description: 'Direct impact',
  },
  {
    icon: Award,
    value: 100,
    suffix: '%',
    label: 'Transparency',
    description: 'Full accountability',
  },
  {
    icon: Target,
    value: 50000,
    suffix: '+',
    label: 'Lives Changed',
    description: 'Annual impact',
  },
  {
    icon: TrendingUp,
    value: 120,
    suffix: '+',
    label: 'Active Projects',
    description: 'Ongoing work',
  },
];

export function About() {
  return (
    <section id="about" className="bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute top-20 left-20 w-64 h-64 border-2 border-[#10B981] rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 border-2 border-[#F59E0B] rounded-full"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
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
            About Us
          </motion.div>
          <h2 className="text-4xl lg:text-5xl text-[#0F172A] mb-4">
            Our Story & Mission
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Building a better Bangladesh through compassion, dedication, and sustainable impact
          </p>
        </motion.div>

        {/* Main Content - 60/40 Split */}
        <div className="grid lg:grid-cols-5 gap-12 mb-20">
          {/* Left: Narrative (60%) */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Story */}
            <div className="mb-12">
              <h3 className="text-3xl text-[#0F172A] mb-6 flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-lg flex items-center justify-center">
                  <span className="text-white text-2xl">🇧🇩</span>
                </div>
                Rooted in Bangladesh
              </h3>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Human Care exists to ignite potential. We motivate young people to realise their worth, equip them with skills and knowledge, and create the conditions for them to lead with confidence and compassion.
                </p>
                <p>
                  Our mission is to build a Bangladesh where no person is held back by poverty, gender, geography, or lack of opportunity — where every individual can contribute meaningfully to their family, their community, and their nation.
                </p>
                <p>
                 We see a Sylhet — and a Bangladesh — where women stand equal, children learn freely, communities govern themselves with transparency, and the environment is protected for generations to come.Human Care's vision is simple: people who are cared for, care for others. That cycle of compassion is how we change the world.
                </p>
              </div>
            </div>

            {/* Mission & Values */}
            <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-2xl p-8 text-white mb-8">
              <h4 className="text-2xl mb-6">Our Values</h4>
              <div className="space-y-4">
                {[
                  'Youth Empowerment',
                  'Gender Equity',
                  'Education',
                  'Community Health',
                  'Climate Action',
                  'Civic Engagement',
                ].map((value, idx) => (
                  <motion.div
                    key={value}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <CheckCircle className="w-5 h-5 text-[#10B981] flex-shrink-0" />
                    <span className="text-white/90">{value}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Journey Timeline */}
            {/* <div>
              <h3 className="text-3xl text-[#0F172A] mb-8">Our Journey</h3>
              <div className="space-y-6">
                {timeline.map((item, index) => (
                  <motion.div
                    key={item.year}
                    className="flex gap-6 group"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                        <span className="font-bold">{item.year}</span>
                      </div>
                    </div>
                    <div className="flex-1 pt-2">
                      <h4 className="text-xl text-[#0F172A] mb-2">{item.title}</h4>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div> */}
          </motion.div>

          {/* Right: Metrics (40%) */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="sticky top-24">
              <h3 className="text-3xl text-[#0F172A] mb-8">By the Numbers</h3>
              
              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {metrics.map((metric, index) => (
                  <motion.div
                    key={metric.label}
                    className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border-2 border-[#10B981]/20 hover:border-[#10B981] transition-all duration-300 hover:shadow-xl group"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <metric.icon className="w-10 h-10 text-[#10B981] mb-4 group-hover:scale-110 transition-transform duration-300" />
                    <div className="text-4xl text-[#0F172A] mb-2">
                      <CounterAnimation end={metric.value} suffix={metric.suffix} />
                    </div>
                    <div className="text-sm text-gray-600 mb-1">{metric.label}</div>
                    <div className="text-xs text-[#10B981]">{metric.description}</div>
                  </motion.div>
                ))}
              </div>

              {/* Certifications */}
              <div className="bg-gradient-to-br from-[#F59E0B]/10 to-[#F59E0B]/5 rounded-2xl p-6 border-2 border-[#F59E0B]/20">
                <h4 className="text-xl text-[#0F172A] mb-4 flex items-center gap-2">
                  <Award className="w-6 h-6 text-[#F59E0B]" />
                  Certifications & Recognition
                </h4>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
                    <span>NGO Affairs Bureau Registered</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
                    <span>ISO 9001:2015 Certified</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
                    <span>National NGO Excellence Award 2023</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
                    <span>Annual Audited Financial Reports</span>
                  </li>
                </ul>
              </div>

              {/* Annual Report Download */}
              {/* <motion.div
                className="mt-6 bg-gradient-to-r from-[#0F172A] to-[#1E293B] rounded-2xl p-6 text-white text-center"
                whileHover={{ scale: 1.02 }}
              >
                <h4 className="text-lg mb-3">2025 Impact Report</h4>
                <p className="text-white/70 text-sm mb-4">
                  Download our comprehensive annual report
                </p>
                <motion.button
                  className="bg-[#10B981] hover:bg-[#059669] text-white px-6 py-3 rounded-full font-semibold transition-colors duration-300 w-full"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Download PDF
                </motion.button>
              </motion.div> */}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
