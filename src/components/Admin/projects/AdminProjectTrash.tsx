"use client";

import React, { useState } from "react";
import {
  Trash2,
  Loader2,
  RotateCcw,
  MapPin,
  ArrowLeft,
  ShieldAlert,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import Swal from "sweetalert2";

import { useProjects } from "@/components/Hooks/useProjects";
import {
  restoreProject,
  deleteProjectPermanent,
} from "@/app/ServerActions/project";
import Link from "next/link";

export default function AdminProjectTrash() {
  const {
    projects: trashedProjects,
    loading,
    refresh,
  } = useProjects(undefined, true);

  const [processingId, setProcessingId] = useState<string | null>(null);
  const [deletingAll, setDeletingAll] = useState(false);

  const handleRestore = async (id: string) => {
    setProcessingId(id);
    try {
      const res = await restoreProject(id);
      if (res.success) {
        toast.success("Project restored");
        refresh();
      } else toast.error("Restore failed");
    } catch {
      toast.error("An error occurred");
    } finally {
      setProcessingId(null);
    }
  };

  const handlePermanentDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Confirm Permanent Deletion",
      text: "This project will be gone forever!",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete it",
    });

    if (!result.isConfirmed) return;

    setProcessingId(id);
    try {
      const res = await deleteProjectPermanent(id);
      if (res.success) {
        toast.success("Project deleted permanently");
        refresh();
      } else toast.error("Delete failed");
    } catch {
      toast.error("An error occurred");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeleteAll = async () => {
    if (!trashedProjects.length) return toast("Trash is empty");

    const result = await Swal.fire({
      title: "Purge all projects?",
      text: `Delete ${trashedProjects.length} projects permanently`,
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      confirmButtonText: "Yes, clear all",
    });

    if (!result.isConfirmed) return;

    try {
      setDeletingAll(true);
      await Promise.all(
        trashedProjects.map((p) => deleteProjectPermanent(p.id))
      );
      toast.success("Trash cleared");
      refresh();
    } catch {
      toast.error("Failed to delete all");
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

  if (!trashedProjects.length)
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-center">
        <div className="bg-slate-100 p-6 rounded-full">
          <Trash2 className="text-slate-400" size={48} />
        </div>
        <p className="text-slate-500">Trash is empty</p>
      </div>
    );

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-6 md:py-10">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm gap-4">
        
        <div className="flex items-center gap-3">
          <Link
            href="/admin/dashboard/projects"
            className="p-3 bg-slate-100 hover:bg-emerald-500 text-slate-600 hover:text-white rounded-xl transition"
          >
            <ArrowLeft size={20} />
          </Link>

          <div>
            <h1 className="text-xl md:text-2xl font-bold text-rose-600">
              Projects Trash
            </h1>
            <p className="text-xs text-slate-500">
              {trashedProjects.length} Projects
            </p>
          </div>
        </div>

        <button
          onClick={handleDeleteAll}
          disabled={deletingAll}
          className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm disabled:opacity-50 cursor-pointer"
        >
          {deletingAll ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <ShieldAlert size={18} />
          )}
          {deletingAll ? "Purging..." : "Empty Trash"}
        </button>
      </div>

      {/* Table */}
      <AnimatePresence>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

          <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                <tr>
                  <th className="px-8 py-4 text-left">Project</th>
                  <th className="px-8 py-4 text-left">Location</th>
                  <th className="px-8 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {trashedProjects.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    
                    <td className="px-8 py-5 flex items-center gap-4">
                      <img
                        src={p.image}
                        className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                      />
                      <span className="font-semibold text-slate-800">
                        {p.title.split(' ').slice(0, 3).join(' ')}
  {p.title.split(' ').length > 3 ? '...' : ''}
                      </span>
                    </td>

                    <td className="px-8 py-5 text-slate-500">
                      {p.location}
                    </td>

                    <td className="px-8 py-5 text-right space-x-6">
                      <button
                                                   onClick={() => handleRestore(p.id)}
                                                  disabled={processingId === p.id}
                                                  className="cursor-pointer text-emerald-600 py-2 rounded-xl text-sm font-medium"
                                                               >
                                                                 <RotateCcw size={14} className="inline mr-1" />
                                                                 Restore
                                                               </button>
                                            <button
                                                                onClick={() => handlePermanentDelete(p.id)}
                                                                disabled={processingId === p.id}
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
          <div className="grid gap-4 md:hidden">
            {trashedProjects.map((p) => (
              <div
                key={p.id}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm"
              >
                <h3 className="font-semibold text-slate-800">{p.title}</h3>
                <p className="text-sm text-slate-500">{p.location}</p>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleRestore(p.id)}
                    className="flex-1 bg-emerald-50 text-emerald-600 py-2 rounded-lg"
                  >
                    Restore
                  </button>

                  <button
                    onClick={() => handlePermanentDelete(p.id)}
                    className="flex-1 bg-rose-50 text-rose-600 py-2 rounded-lg"
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