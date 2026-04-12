"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Pencil, Loader2, Megaphone } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import Swal from "sweetalert2";

import { useNotices } from "@/components/Hooks/useNotices";
import { moveNoticeToTrash, upsertNotice } from "@/app/ServerActions/notice";
import NoticeForm from "./NoticeForm";

export default function AdminNotices() {
  const { notices, latestNotices, loading, refresh } = useNotices();
  const [showForm, setShowForm] = useState(false);
  const [editingNotice, setEditingNotice] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const allNotices = [...latestNotices, ...notices];

  const handleEdit = (notice: any) => {
    setEditingNotice(notice);
    setShowForm(true);
  };

  const handleTrash = async (id: string) => {
    const result = await Swal.fire({
      title: "Move notice to trash?",
      text: "You can restore it later from trash.",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, move to trash",
    });

    if (result.isConfirmed) {
      const res = await moveNoticeToTrash(id);
      if (res.success) {
        toast.success("Notice moved to trash");
        refresh();
      } else {
        toast.error(res.error || "Failed to move notice");
      }
    }
  };

  const handleFormSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      const res = await upsertNotice(formData);
      if (res.success) {
        toast.success(
          editingNotice ? "Notice updated successfully" : "Notice published"
        );
        setShowForm(false);
        setEditingNotice(null);
        refresh();
      } else {
        toast.error(res.error || "Failed to save notice");
      }
    } catch {
      toast.error("Unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && allNotices.length === 0)
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <Loader2 className="animate-spin text-emerald-500" size={40} />
      </div>
    );

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl border border-slate-200 gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-100 rounded-xl">
            <Megaphone className="text-emerald-600" size={26} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Notice Board
            </h1>
            <p className="text-slate-500 text-sm">
              Manage public announcements
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {/* Trash */}
          <Link
            href="/admin/dashboard/notices/trash"
            className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm transition cursor-pointer"
          >
            <Trash2 size={18} /> Trash
          </Link>

          {/* New */}
          {!showForm && (
            <button
              onClick={() => {
                setEditingNotice(null);
                setShowForm(true);
              }}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm transition cursor-pointer"
            >
              <Plus size={18} /> New Notice
            </button>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {showForm ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <NoticeForm
              key={editingNotice?.id || "new"}
              initialData={editingNotice}
              onClose={() => {
                setShowForm(false);
                setEditingNotice(null);
              }}
              onSubmit={handleFormSubmit}
              isSubmitting={isSubmitting}
            />
          </motion.div>
        ) : (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Desktop */}
            <div className="hidden md:block bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-slate-500 text-xs uppercase">
                  <tr>
                    <th className="px-8 py-4">Notice</th>
                    <th className="px-8 py-4">Date</th>
                    <th className="px-8 py-4">Status</th>
                    <th className="px-8 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">
                  {allNotices.map((notice) => (
                    <tr
                      key={notice.id}
                      className="hover:bg-slate-50 transition"
                    >
                      <td className="px-8 py-4 flex items-center gap-4">
                        {notice.image && (
                          <img
                            src={notice.image}
                            className="w-12 h-12 rounded-lg object-cover border"
                          />
                        )}
                        <div>
                          <p className="font-semibold text-slate-800 line-clamp-1">
                        
                            {notice.title.split(' ').slice(0, 3).join(' ')}
                           {notice.title.split(' ').length > 3 ? '...' : ''}
                          </p>
                          <p className="text-xs text-slate-500">
                            {notice.type}
                          </p>
                        </div>
                      </td>

                      <td className="px-8 py-4 text-slate-500 text-sm">
                        {new Date(notice.date).toLocaleDateString()}
                      </td>

                      <td className="px-8 py-4">
                        {notice.latest ? (
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-600 text-xs rounded-full">
                            Featured
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-slate-100 text-slate-500 text-xs rounded-full">
                            Archived
                          </span>
                        )}
                      </td>

                      <td className="px-8 py-4 text-right space-x-2">
                        <button
                          onClick={() => handleEdit(notice)}
                          className="p-2 text-cyan-500 hover:bg-cyan-100 rounded-lg cursor-pointer"
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          onClick={() => handleTrash(notice.id)}
                          className="p-2 text-rose-500 hover:bg-rose-100 rounded-lg cursor-pointer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {allNotices.length === 0 && !loading && (
                <div className="p-12 text-center">
                  <Megaphone className="text-slate-300 mx-auto mb-3" size={36} />
                  <p className="text-slate-500 text-sm">
                    No notices yet. Create one.
                  </p>
                </div>
              )}
            </div>

            {/* Mobile */}
            <div className="flex flex-col gap-4 md:hidden">
              {allNotices.map((notice) => (
                <div
                  key={notice.id}
                  className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    {notice.image && (
                      <img
                        src={notice.image}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800 truncate">
                        {notice.slug}
                      </p>
                      <p className="text-slate-500 text-xs">
                        {notice.type}
                      </p>
                      <p className="text-sm text-slate-400 mt-1">
                        {new Date(notice.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 mt-3">
                    <button
                      onClick={() => handleEdit(notice)}
                      className="p-2 text-cyan-500 hover:bg-cyan-100 rounded-lg cursor-pointer"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      onClick={() => handleTrash(notice.id)}
                      className="p-2 text-rose-500 hover:bg-rose-100 rounded-lg cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}