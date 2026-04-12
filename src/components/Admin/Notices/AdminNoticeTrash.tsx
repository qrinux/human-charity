"use client";

import { useState } from "react";
import {
  Trash2,
  Loader2,
  Megaphone,
  RotateCcw,
  Calendar,
  ArrowLeft,
  ShieldAlert,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import Swal from "sweetalert2";
import Link from "next/link";

import { useNotices } from "@/components/Hooks/useNotices";
import {
  restoreNotice,
  deleteNoticePermanent,
} from "@/app/ServerActions/notice";

export default function AdminNoticeTrash() {
  const { notices: trashedNotices, loading, refresh } = useNotices(
    undefined,
    true
  );

  const [processingId, setProcessingId] = useState<string | null>(null);
  const [deletingAll, setDeletingAll] = useState(false);

  const handleRestore = async (id: string) => {
    setProcessingId(id);
    try {
      const res = await restoreNotice(id);
      if (res.success) {
        toast.success("Notice restored");
        refresh();
      } else toast.error("Restore failed");
    } catch {
      toast.error("Error restoring notice");
    } finally {
      setProcessingId(null);
    }
  };

  const handlePermanentDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Delete permanently?",
      text: "This action cannot be undone.",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Delete",
    });

    if (!result.isConfirmed) return;

    setProcessingId(id);
    try {
      const res = await deleteNoticePermanent(id);
      if (res.success) {
        toast.success("Notice deleted");
        refresh();
      } else toast.error("Delete failed");
    } catch {
      toast.error("Error deleting notice");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeleteAll = async () => {
    if (!trashedNotices.length) return toast("Trash is empty");

    const result = await Swal.fire({
      title: "Delete all notices?",
      text: `Permanently delete ${trashedNotices.length} notices`,
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      confirmButtonText: "Delete all",
    });

    if (!result.isConfirmed) return;

    try {
      setDeletingAll(true);
      await Promise.all(
        trashedNotices.map((n) => deleteNoticePermanent(n.id))
      );
      toast.success("Trash cleared");
      refresh();
    } catch {
      toast.error("Failed to clear trash");
    } finally {
      setDeletingAll(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-emerald-500" size={40} />
      </div>
    );

  if (!trashedNotices.length)
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <Megaphone className="text-slate-300 mb-3" size={40} />
        <p className="text-slate-500">No trashed notices</p>
      </div>
    );

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/dashboard/notices"
            className="p-3 bg-slate-100 hover:bg-emerald-500 hover:text-white rounded-xl transition cursor-pointer"
          >
            <ArrowLeft size={18} />
          </Link>

          <div>
            <h1 className="text-xl font-bold text-rose-500">
              Notice Trash
            </h1>
            <p className="text-sm text-slate-500">
              {trashedNotices.length} items
            </p>
          </div>
        </div>

        <button
          onClick={handleDeleteAll}
          disabled={deletingAll}
          className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-5 py-2.5 rounded-xl transition cursor-pointer disabled:opacity-50"
        >
          {deletingAll ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <ShieldAlert size={16} />
          )}
          {deletingAll ? "Deleting..." : "Empty Trash"}
        </button>
      </div>

      <AnimatePresence>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Desktop */}
          <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-slate-500 text-xs uppercase">
                <tr>
                  <th className="px-8 py-4">Notice</th>
                  <th className="px-8 py-4">Date</th>
                  <th className="px-8 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {trashedNotices.map((notice) => (
                  <tr key={notice.id} className="hover:bg-slate-50">
                    <td className="px-8 py-4 flex items-center gap-4">
                      {notice.image && (
                        <img
                          src={notice.image}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <p className="font-semibold text-slate-800">
                          {notice.slug}
                        </p>
                        <p className="text-xs text-slate-500">
                          {notice.type}
                        </p>
                      </div>
                    </td>

                    <td className="px-8 py-4 text-slate-500 text-sm">
                      {new Date(notice.date).toLocaleDateString()}
                    </td>

                    <td className="px-8 py-4 text-right space-x-6">
          
                        <button
                             onClick={() => handleRestore(notice.id)}
                            disabled={processingId === notice.id}
                            className="cursor-pointer text-emerald-600 py-2 rounded-xl text-sm font-medium"
                                         >
                                           <RotateCcw size={14} className="inline mr-1" />
                                           Restore
                                         </button>
                      <button
                                          onClick={() => handlePermanentDelete(notice.id)}
                                          disabled={processingId === notice.id}
                                          className="cursor-pointer  text-rose-600 py-2 rounded-xl text-sm font-medium"
                                        >
                                          <Trash2 size={14} className="inline mr-1" />
                                          Delete
                                        </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="md:hidden flex flex-col gap-4">
            {trashedNotices.map((notice) => (
              <div
                key={notice.id}
                className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm"
              >
                <div className="flex gap-3">
                  {notice.image && (
                    <img
                      src={notice.image}
                      className="w-14 h-14 rounded-lg object-cover"
                    />
                  )}

                  <div className="flex-1">
                    <p className="font-semibold text-slate-800">
                      {notice.slug}
                    </p>
                    <p className="text-xs text-slate-500">
                      {notice.type}
                    </p>

                    <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                      <Calendar size={12} />
                      {new Date(notice.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleRestore(notice.id)}
                    className="flex-1 bg-emerald-100 text-emerald-600 py-2 rounded-lg cursor-pointer"
                  >
                    Restore
                  </button>

                  <button
                    onClick={() =>
                      handlePermanentDelete(notice.id)
                    }
                    className="flex-1 bg-rose-100 text-rose-500 py-2 rounded-lg cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}