"use client";

import React, { useState } from "react";
import {
  Trash2,
  Users,
  Loader2,
  RotateCcw,
  ShieldAlert,
  ArrowLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import Swal from "sweetalert2";
import Link from "next/link";

import { useTeam } from "@/components/Hooks/useTeam";
import {
  restoreTeamMember,
  deleteTeamPermanent,
} from "@/app/ServerActions/team";

export default function AdminTeamTrash() {
  const { team, loading, refresh } = useTeam(undefined, true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [deletingAll, setDeletingAll] = useState(false);

  const deletedMembers = team.filter((member) => member.isDeleted);

  const handleRestore = async (id: string) => {
    setProcessingId(id);
    try {
      const res = await restoreTeamMember(id);
      if (res.success) {
        toast.success("Team member restored");
        refresh();
      } else {
        toast.error(res.error || "Restore failed");
      }
    } finally {
      setProcessingId(null);
    }
  };

  const handlePermanentDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete permanently",
      background: "#ffffff",
      color: "#111827",
    });

    if (result.isConfirmed) {
      setProcessingId(id);
      try {
        const res = await deleteTeamPermanent(id);
        if (res.success) {
          toast.success("Member deleted permanently");
          refresh();
        } else {
          toast.error(res.error || "Delete failed");
        }
      } finally {
        setProcessingId(null);
      }
    }
  };

  const handleDeleteAll = async () => {
    if (!deletedMembers.length) return toast("Trash is empty");

    const result = await Swal.fire({
      title: "Empty Trash?",
      text: `Permanently delete ${deletedMembers.length} members?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      confirmButtonText: "Yes, delete all",
      background: "#ffffff",
      color: "#111827",
    });

    if (result.isConfirmed) {
      try {
        setDeletingAll(true);
        await Promise.all(
          deletedMembers.map((m) => deleteTeamPermanent(m.id))
        );
        toast.success("Trash cleared");
        refresh();
      } finally {
        setDeletingAll(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="animate-spin text-emerald-500" size={40} />
      </div>
    );
  }

  if (deletedMembers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 px-4 text-center">
        <div className="bg-gray-100 p-6 rounded-full">
          <Users className="text-gray-400" size={48} />
        </div>
        <div>
          <h3 className="text-gray-800 font-medium text-lg">Trash is empty</h3>
          <p className="text-gray-500 text-sm max-w-xs">
            No deleted team members found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-6 md:py-10 min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-5 md:p-6 rounded-2xl border border-gray-200 shadow-sm gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/dashboard/team"
            className="group p-3 bg-gray-100 hover:bg-emerald-500 text-gray-600 hover:text-white rounded-2xl transition-all cursor-pointer"
          >
            <ArrowLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
          </Link>

          <div>
            <h1 className="text-xl md:text-2xl font-bold text-red-500">
              Team Trash
            </h1>
            <p className="text-xs text-gray-500">
              {deletedMembers.length} member found
            </p>
          </div>
        </div>

        <button
          onClick={handleDeleteAll}
          disabled={deletingAll}
          className="cursor-pointer flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-5 py-2.5 rounded-xl transition-all disabled:opacity-50 font-medium text-sm"
        >
          {deletingAll ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <ShieldAlert size={18} />
          )}
          {deletingAll ? "Deleting..." : "Empty Trash"}
        </button>
      </div>

      {/* CONTENT */}
      <AnimatePresence mode="wait">
        <motion.div
          key="trash"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          {/* TABLE (DESKTOP) */}
          <div className="hidden md:block overflow-hidden bg-white rounded-2xl border border-gray-200 shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="px-8 py-5">Member</th>
                  <th className="px-8 py-5">Role</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {deletedMembers.map((member) => (
                  <tr
                    key={member.id}
                    className="border-t border-gray-200 hover:bg-gray-50 transition"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <img
                          src={member.image || "/placeholder-user.png"}
                          className="h-11 w-11 rounded-lg border border-gray-200 object-cover"
                        />
                        <div>
                          <div className="font-semibold text-gray-800">
                            {member.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {member.email || "No email"}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-8 py-5 text-gray-600">
                      {member.role}
                    </td>

                    <td className="px-8 py-5 text-right space-x-2">
                      <button
                        onClick={() => handleRestore(member.id)}
                        disabled={processingId === member.id}
                        className="cursor-pointer inline-flex items-center gap-1 px-3 py-1.5 text-sm text-emerald-600 hover:bg-emerald-50 rounded-lg transition disabled:opacity-50"
                      >
                        <RotateCcw size={14} /> Restore
                      </button>

                      <button
                        onClick={() => handlePermanentDelete(member.id)}
                        disabled={processingId === member.id}
                        className="cursor-pointer inline-flex items-center gap-1 px-3 py-1.5 text-sm text-rose-600 hover:bg-rose-50 rounded-lg transition disabled:opacity-50"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARDS */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {deletedMembers.map((member) => (
              <div
                key={member.id}
                className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={member.image || "/placeholder-user.png"}
                    className="h-14 w-14 rounded-xl border border-gray-200 object-cover"
                  />

                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {member.name}
                    </h3>
                    <p className="text-xs text-gray-500">{member.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                      {member.role}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200">
                  <button
                    onClick={() => handleRestore(member.id)}
                    disabled={processingId === member.id}
                    className="cursor-pointer bg-emerald-50 text-emerald-600 py-2 rounded-xl text-sm font-medium"
                  >
                    <RotateCcw size={14} className="inline mr-1" />
                    Restore
                  </button>

                  <button
                    onClick={() => handlePermanentDelete(member.id)}
                    disabled={processingId === member.id}
                    className="cursor-pointer bg-rose-50 text-rose-600 py-2 rounded-xl text-sm font-medium"
                  >
                    <Trash2 size={14} className="inline mr-1" />
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