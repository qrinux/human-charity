"use client";
import { motion } from 'motion/react';
import { Bell, Calendar, TrendingUp, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useNotices } from '@/components/Hooks/useNotices';

export function Notices() {
  const { latestNotices, loading } = useNotices();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <Loader2 className="animate-spin text-emerald-500" size={50} />
      </div>
    );
  }

  return (
    <section id="updates" className="pb-24 pt-12 bg-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(#10B981 1px, transparent 1px), linear-gradient(90deg, #10B981 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        ></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#F59E0B]/10 text-[#F59E0B] px-4 py-2 rounded-full text-sm mb-4">
            <Bell className="w-4 h-4" />
            Latest Updates
          </div>
          <h2 className="text-4xl lg:text-5xl text-[#0F172A] mb-4">
            News & Notices
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8  mx-auto">
          {latestNotices.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-xl border-2 border-dashed">
              <p className="text-gray-500">
                No recent updates marked as "Latest".
              </p>
            </div>
          ) : 
          (
            latestNotices.map((update, index) => (
              <motion.div
                key={update.id || index}
                className="h-full"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div
                  className={`bg-white rounded-xl p-6 shadow-lg border-l-4 group hover:-translate-y-1 transition-all h-full flex flex-col ${
                    update.type === 'urgent'
                      ? 'border-[#F59E0B]'
                      : update.type === 'success'
                      ? 'border-[#10B981]'
                      : 'border-[#0F172A]'
                  }`}
                >
                  {/* Date + Badge */}
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {update.date
                          ? new Date(update.date).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : 'No Date'}
                      </span>
                    </div>

                    {update.latest && (
                      <span className="inline-flex items-center gap-1 bg-[#10B981]/10 text-[#10B981] px-3 py-1 rounded-full text-xs font-medium">
                        <TrendingUp className="w-3 h-3" /> Latest
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-[#0F172A] mb-2 group-hover:text-[#10B981] transition-colors">
                    {update.title}
                  </h3>

                  {/* Description with line clamp */}
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {update.description}
                  </p>

                  {/* Button bottom align */}
                  <div className="mt-auto">
                    <Link href={`/notices/${update.slug}`}>
                      <span className="text-[#10B981] font-semibold flex items-center gap-2 cursor-pointer hover:gap-3 transition-all">
                        Read More <span>→</span>
                      </span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        <div className="text-center mt-12">
          <Link href="/notices">
            <button className="bg-[#0F172A] hover:bg-[#1E293B] text-white px-8 py-4 rounded-full font-semibold shadow-xl transition-all cursor-pointer">
              View All Updates
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}