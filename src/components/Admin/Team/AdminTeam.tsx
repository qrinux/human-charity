"use client";

import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Loader2, Users, GripVertical } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import Swal from "sweetalert2";
import Link from "next/link";

// DND Kit Imports
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { useTeam } from "@/components/Hooks/useTeam";
import { moveTeamToTrash, upsertTeam, reorderTeam } from "@/app/ServerActions/team";
import { TeamForm } from "./TeamForm";

/* ---------------- SORTABLE ROW COMPONENT ---------------- */
const SortableRow = ({ member, handleEdit, handleDelete }: any) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: member.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 0,
    position: "relative" as "relative",
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`group border-b border-slate-800 transition-colors ${
        isDragging ? "bg-slate-700/50 shadow-2xl" : "hover:bg-slate-800/30"
      }`}
    >
      <td className="px-4 py-5 w-10">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-slate-600 hover:text-emerald-500 transition-colors"
        >
          <GripVertical size={20} />
        </button>
      </td>
      <td className="px-4 py-5 flex items-center gap-4">
        <div className="h-12 w-12 rounded-lg bg-slate-900 overflow-hidden border border-slate-700 shrink-0">
          <img
            src={member.image || "/placeholder-user.png"}
            alt={member.name}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-slate-200 truncate">{member.name}</span>
          <span className="text-[10px] uppercase text-slate-500 truncate">
            {member.email || "No email"}
          </span>
        </div>
      </td>
      <td className="px-8 py-5">
        <div className="text-slate-300 font-medium">{member.role}</div>
        <div className="text-sm text-slate-500 mt-1">{member.memberType}</div>
      </td>
      <td className="px-8 py-5 text-right space-x-2">
        <button
          onClick={() => handleEdit(member)}
          className="p-2 text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-all cursor-pointer"
        >
          <Pencil size={18} />
        </button>
        <button
          onClick={() => handleDelete(member)}
          className="p-2 text-rose-400 hover:bg-rose-400/10 rounded-lg transition-all cursor-pointer"
        >
          <Trash2 size={18} />
        </button>
      </td>
    </tr>
  );
};

/* ---------------- MAIN PAGE COMPONENT ---------------- */
export default function AdminTeamPage() {
  const { team, setTeam, loading, refresh } = useTeam();
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);

  // DND Kit Sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = team.findIndex((m) => m.id === active.id);
      const newIndex = team.findIndex((m) => m.id === over.id);

      const newOrder = arrayMove(team, oldIndex, newIndex);
      
  
      setTeam(newOrder);

      const reorderPayload = newOrder.map((member, index) => ({
        id: member.id,
        order: index,
      }));

      const res = await reorderTeam(reorderPayload);
      if (!res.success) {
        toast.error("Failed to save new order");
        refresh(); // Rollback on error
      } else {
        toast.success("Order updated");
      }
    }
  };

  const handleEdit = (member: any) => {
    setEditingMember(member);
    setShowForm(true);
  };

  const handleDelete = async (member: any) => {
    const result = await Swal.fire({
      title: "Move to Trash?",
      text: `${member.name} will be moved to trash.`,
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, move",
    });
    if (result.isConfirmed) executeMoveToTrash(member.id);
  };

  const executeMoveToTrash = async (id: string) => {
    try {
      const res = await moveTeamToTrash(id);
      if (res.success) {
        toast.success("Team member moved to Trash");
        refresh();
      }
    } catch (err) {
      toast.error("Unexpected error occurred");
    }
  };

  const handleFormSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      if (editingMember?.id) formData.append("id", editingMember.id);
      const res = await upsertTeam(formData);
      if (res.success) {
        toast.success(editingMember ? "Member updated" : "Member added");
        setShowForm(false);
        setEditingMember(null);
        refresh();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && team.length === 0)
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <Loader2 className="animate-spin text-emerald-500" size={40} />
      </div>
    );

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-8">
  
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-[#1e293b] p-6 rounded-2xl border border-slate-800 gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 rounded-xl">
            <Users className="text-emerald-500" size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Team Management</h1>
            <p className="text-slate-400 text-sm">Manage your organization's core members</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/dashboard/team/trash" className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 rounded-xl font-semibold transition-all">
            <Trash2 size={18} /> Trash
          </Link>
          <button onClick={() => { setEditingMember(null); setShowForm(true); }} className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold transition-all">
            <Plus size={20} /> Add Member
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {showForm ? (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <TeamForm
              initialData={editingMember}
              isSubmitting={isSubmitting}
              onClose={() => { setShowForm(false); setEditingMember(null); }}
              onSubmit={handleFormSubmit}
            />
          </motion.div>
        ) : (
          <motion.div key="table" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="bg-[#1e293b] rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <table className="w-full text-left">
                    <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-5 w-10"></th>
                        <th className="px-4 py-5">Our Team</th>
                        <th className="px-8 py-5">Role & Expertise</th>
                        <th className="px-8 py-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      <SortableContext items={team.map((m) => m.id)} strategy={verticalListSortingStrategy}>
                        {team.map((member) => (
                          <SortableRow
                            key={member.id}
                            member={member}
                            handleEdit={handleEdit}
                            handleDelete={handleDelete}
                          />
                        ))}
                      </SortableContext>
                    </tbody>
                  </table>
                </DndContext>
              </div>
              {team.length === 0 && (
                <div className="p-12 text-center text-slate-400">No members found.</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}