"use client";

import { motion } from 'motion/react';
import { ArrowLeft, Calendar, TrendingUp, Bell, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useNotices } from '@/components/Hooks/useNotices';

export function AllNotice() {
  const { notices, latestNotices, loading } = useNotices();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <Loader2 className="animate-spin text-emerald-500" size={40} />
      </div>
    );
  }

  const allUpdates = [...latestNotices, ...notices];

  return (
    <div className="min-h-screen bg-white">
      <div className="pt-32 pb-24">
        <div className="container mx-auto px-6">
          <Link href="/">
            <motion.button
              className="flex items-center gap-2 text-gray-600 hover:text-[#10B981] mb-8 transition-colors duration-300 cursor-pointer"
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
              className="inline-flex items-center gap-2 bg-[#F59E0B]/10 text-[#F59E0B] px-4 py-2 rounded-full text-sm mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Bell className="w-4 h-4" />
              Archive & Updates
            </motion.div>

            <h1 className="text-5xl font-bold text-[#0F172A] mb-4">
              News & Notices
            </h1>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Browse our full history of announcements and project updates.
            </p>
          </motion.div>

          {/* GRID WRAPPER UPDATED */}
          {allUpdates.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <p className="text-gray-500">No notices found at this time.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {allUpdates.map((update, index) => (
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
                    {/* Date */}
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

                    {/* Description */}
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {update.description}
                    </p>

                    {/* Read More */}
                    <div className="mt-auto">
                      <Link href={`/notices/${update.slug}`}>
                        <span className="text-[#10B981] font-semibold flex items-center gap-2 cursor-pointer hover:gap-3 transition-all">
                          Read More <span>→</span>
                        </span>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Newsletter Section (unchanged) */}
          <motion.div
            className="mt-24 text-center bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-3xl p-12 text-white max-w-4xl mx-auto shadow-2xl relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="relative z-10">
              <Bell className="w-12 h-12 mx-auto mb-4 text-[#10B981]" />
              <h3 className="text-3xl font-bold mb-3">Stay in the Loop</h3>
              <p className="text-white/70 mb-8 max-w-xl mx-auto">
                Subscribe to our newsletter to receive the latest news and impact stories directly to your inbox.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#10B981] transition-all"
                />
                <motion.button
                  className="bg-[#10B981] hover:bg-[#059669] text-white px-8 py-4 rounded-full font-bold shadow-lg transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Subscribe
                </motion.button>
              </div>
            </div>

            <div className="absolute top-0 right-0 w-32 h-32 bg-[#10B981] opacity-10 blur-3xl -mr-16 -mt-16 rounded-full"></div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}