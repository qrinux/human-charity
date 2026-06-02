"use client";

import React, { useEffect, useState } from "react";
import {
  Trash2,
  Loader2,
  RotateCcw,
  ShieldAlert,
  Users,
  Mail,
  ArrowLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import Swal from "sweetalert2";

import {
  getDeletedUsers,
  restoreUser,
  permanentDeleteUser,
} from "@/app/ServerActions/user";
import Link from "next/link";

export default function AdminUserTrashPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [deletingAll, setDeletingAll] = useState(false);

  const fetchTrash = async () => {
    setLoading(true);
    try {
      const data = await getDeletedUsers();
      setUsers(data);
    } catch {
      toast.error("Failed to load trash users");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTrash();
  }, []);

  const handleRestore = async (id: string) => {
    setProcessingId(id);
    try {
      await restoreUser(id);
      toast.success("User restored");
      fetchTrash();
    } catch {
      toast.error("Restore failed");
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
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete permanently",
      background: "#ffffff",
      color: "#111827",
    });

    if (result.isConfirmed) {
      setProcessingId(id);
      try {
        await permanentDeleteUser(id);
        toast.success("User permanently deleted");
        fetchTrash();
      } catch {
        toast.error("Delete failed");
      } finally {
        setProcessingId(null);
      }
    }
  };

  const handleDeleteAll = async () => {
    if (!users.length) return toast("Trash is empty");

    const result = await Swal.fire({
      title: "Purge Trash?",
      text: `Delete ${users.length} users permanently.`,
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, Purge All",
      background: "#ffffff",
      color: "#111827",
    });

    if (result.isConfirmed) {
      setDeletingAll(true);
      try {
        await Promise.all(users.map((u) => permanentDeleteUser(u.id)));
        toast.success("Trash emptied");
        fetchTrash();
      } catch {
        toast.error("Failed to clear trash");
      } finally {
        setDeletingAll(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 bg-white ">
        <Loader2 className="animate-spin text-emerald-500" size={40} />
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-center  text-gray-900">
        <div className="bg-gray-100 p-6 rounded-full">
          <Users className="text-gray-400" size={48} />
        </div>
        <h3 className="font-medium text-lg text-gray-800">
          Trash is empty
        </h3>
        <p className="text-gray-500 text-sm">
          No deleted users found
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-6 md:py-10  text-gray-900">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-5 md:p-6 rounded-2xl border border-gray-200 gap-4 shadow-lg text-gray-900">

        <div className="flex items-center gap-3">
          <Link
            href="/admin/dashboard/users"
            className="group p-3 bg-gray-100 hover:bg-emerald-500 text-gray-600 hover:text-white rounded-2xl transition-all cursor-pointer"
          >
            <ArrowLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
          </Link>

          <div>
            <h1 className="text-xl md:text-2xl font-bold text-red-500">
              User Trash
            </h1>
            <p className="text-xs text-gray-500">
              {users.length} users found
            </p>
          </div>
        </div>

        <button
          onClick={handleDeleteAll}
          disabled={deletingAll}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 rounded-xl transition-all disabled:opacity-50 font-medium text-sm cursor-pointer"
        >
          {deletingAll ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <ShieldAlert size={18} />
          )}
          {deletingAll ? "Purging..." : "Empty Trash"}
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

          {/* DESKTOP */}
          <div className="hidden md:block overflow-hidden bg-white rounded-2xl border border-gray-200 shadow-xl">

            <table className="w-full text-left">

              <thead className="bg-gray-100 text-gray-600 text-xs uppercase">
                <tr>
                  <th className="px-8 py-5">User</th>
                  <th className="px-8 py-5">Email</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">

                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 text-gray-900">

                    <td className="px-8 py-5 flex items-center gap-4">
                      <div className="h-11 w-11 rounded-lg overflow-hidden border border-gray-200">
                        <img src={user.imageUrl} className="w-full h-full object-cover" />
                      </div>

                      <span className="text-gray-900 font-bold">
                        {user.name}
                      </span>
                    </td>

                    <td className="px-8 py-5 text-gray-600">
                      {user.email}
                    </td>

                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2">

                        <button
                          onClick={() => handleRestore(user.id)}
                          disabled={processingId === user.id}
                          className="flex items-center gap-1 px-3 py-1 text-sm text-emerald-600 hover:bg-emerald-100 rounded-lg cursor-pointer"
                        >
                          <RotateCcw size={14} /> Restore
                        </button>

                        <button
                          onClick={() => handlePermanentDelete(user.id)}
                          disabled={processingId === user.id}
                          className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:bg-red-100 rounded-lg cursor-pointer"
                        >
                          <Trash2 size={14} /> Delete
                        </button>

                      </div>
                    </td>

                  </tr>
                ))}

              </tbody>
            </table>
          </div>

          {/* MOBILE */}
          <div className="grid grid-cols-1 gap-4 md:hidden">

            {users.map((user) => (
              <div
                key={user.id}
                className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm"
              >

                <div className="flex items-center gap-4">

                  <div className="h-14 w-14 rounded-xl overflow-hidden border border-gray-200">
                    <img src={user.imageUrl} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1">

                    <h3 className="text-gray-900 font-bold">
                      {user.name}
                    </h3>

                    <p className="text-gray-500 text-xs flex items-center gap-1 mt-1">
                      <Mail size={12} />
                      {user.email}
                    </p>

                  </div>

                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">

                  <button
                    onClick={() => handleRestore(user.id)}
                    className="flex items-center justify-center gap-2 py-2 bg-emerald-100 text-emerald-600 rounded-xl cursor-pointer"
                  >
                    <RotateCcw size={16} /> Restore
                  </button>

                  <button
                    onClick={() => handlePermanentDelete(user.id)}
                    className="flex items-center justify-center gap-2 py-2 bg-red-100 text-red-600 rounded-xl cursor-pointer"
                  >
                    <Trash2 size={16} /> delete
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