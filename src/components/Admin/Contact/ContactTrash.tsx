"use client";

import { useState } from "react";
import { Trash2, X, Calendar, User, Loader2, ArrowLeft, ShieldAlert, Mail } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { restoreContact, deleteContactPermanent } from "@/app/ServerActions/contact";
import { useContacts } from "@/components/Hooks/useContact";
import Swal from "sweetalert2";
import Link from "next/link";

export default function AdminContactTrash() {
  const { contacts: trashedContacts, loading, refresh } = useContacts(undefined, true);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [deletingAll, setDeletingAll] = useState(false);

  const handleRestore = async (id: string) => {
    const res = await restoreContact(id);
    if (res.success) {
      toast.success("Contact restored");
      refresh();
    }
  };

  const handlePermanentDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This Contact will be permanently deleted!",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      const res = await deleteContactPermanent(id);
      if (res.success) {
        toast.success("Contact permanently deleted");
        refresh();
      }
    }
  };

  const handleDeleteAll = async () => {
    if (!trashedContacts.length) return toast("Trash is already empty");

    const result = await Swal.fire({
      title: "Delete all Contacts?",
      text: "This will permanently delete all trashed contacts!",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete all!",

    });

    if (result.isConfirmed) {
      try {
        setDeletingAll(true);
        for (const msg of trashedContacts) {
          await deleteContactPermanent(msg.id);
        }
        toast.success("All trashed contacts deleted");
        refresh();
      } catch (error) {
        toast.error("Failed to delete all contact");
      } finally {
        setDeletingAll(false);
      }
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <Loader2 className="animate-spin text-emerald-500" size={40} />
      </div>
    );

  if (trashedContacts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-center">
        <div className="bg-slate-100 p-6 rounded-full">
          <Mail className="text-slate-400" size={48} />
        </div>
        <h3 className="text-slate-900 font-medium text-lg">
          Trash is empty
        </h3>
        <p className="text-slate-500 text-sm">
          No deleted contact found
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-5 md:p-6 rounded-2xl border border-slate-200 gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/dashboard/contacts"
            className="group p-3 bg-slate-100 hover:bg-emerald-600 text-slate-600 hover:text-white rounded-2xl transition-all cursor-pointer"
          >
            <ArrowLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
          </Link>

          <div>
            <h1 className="text-xl md:text-2xl font-bold text-rose-600">
              Contacts Trash
            </h1>
            <p className="text-xs text-slate-500">
              {trashedContacts.length} messages found
            </p>
          </div>
        </div>

        <button
          onClick={handleDeleteAll}
          disabled={deletingAll}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-5 py-2.5 rounded-xl transition-all disabled:opacity-50 font-medium text-sm cursor-pointer"
        >
          {deletingAll ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <ShieldAlert size={18} />
          )}
          {deletingAll ? "Purging..." : "Empty Trash"}
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {trashedContacts.map((c: any) => (
          <div
            key={c.id}
            onClick={() => setSelectedMessage(c)}
            className="bg-white border border-slate-200 rounded-2xl p-4 shadow hover:shadow-lg cursor-pointer transition-all"
          >
            <div className="flex justify-between items-center mb-2">
              <div className="font-bold text-slate-900 text-sm">{c.name}</div>

              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRestore(c.id);
                  }}
                  className="p-1 text-emerald-600 hover:bg-emerald-50 rounded transition-all cursor-pointer"
                >
                  Restore
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePermanentDelete(c.id);
                  }}
                  className="p-1 text-rose-600 hover:bg-rose-50 rounded transition-all cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="text-slate-500 text-xs mb-1 flex items-center gap-1">
              <Mail size={12} /> {c.email}
            </div>

            <div className="text-emerald-600 text-xs font-semibold mb-1">
              {c.subject}
            </div>

            <div className="text-slate-400 text-[10px] flex items-center gap-1">
              <Calendar size={12} />{" "}
              {new Date(c.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMessage(null)}
              className="absolute inset-0 bg-black/40"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-200 flex justify-between items-start bg-slate-50">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {selectedMessage.subject}
                  </h2>

                  <div className="flex items-center gap-4 mt-2 flex-wrap">
                    <span className="flex items-center gap-1.5 text-emerald-600 text-xs font-medium bg-emerald-50 px-2.5 py-1 rounded-full">
                      <User size={12} /> {selectedMessage.name}
                    </span>

                    <span className="text-slate-500 text-xs flex items-center gap-1">
                      <Calendar size={12} />{" "}
                      {new Date(selectedMessage.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedMessage(null)}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">
                      Email Address
                    </p>
                    <p className="text-slate-800 text-sm break-all">
                      {selectedMessage.email}
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">
                      Phone Number
                    </p>
                    <p className="text-slate-800 text-sm">
                      {selectedMessage.phone || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] uppercase font-bold text-slate-500">
                    Message
                  </p>

                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-slate-700 italic">
                    "{selectedMessage.message}"
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
                <button
                  onClick={() => handleRestore(selectedMessage.id)}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all cursor-pointer"
                >
                  Restore
                </button>

                <button
                  onClick={() => handlePermanentDelete(selectedMessage.id)}
                  className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold transition-all cursor-pointer"
                >
                  Delete permanently
                </button>

                <button
                  onClick={() => setSelectedMessage(null)}
                  className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}