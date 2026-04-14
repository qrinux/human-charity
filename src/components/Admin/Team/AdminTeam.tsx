"use client";

import React, { useState } from "react";
import { Plus, Pencil, Trash2, Loader2, Users, GripVertical } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import Swal from "sweetalert2";
import Link from "next/link";

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

/* ---------------- SORTABLE ROW ---------------- */
const SortableRow = ({ member, handleEdit, handleDelete }: any) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: member.id });

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
      className={`border-b border-gray-200 transition ${
        isDragging ? "bg-gray-100 shadow-lg" : "hover:bg-gray-50"
      }`}
    >
      <td className="px-4 py-5 w-10">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-emerald-500"
        >
          <GripVertical size={20} />
        </button>
      </td>

      <td className="px-4 py-5 flex items-center gap-4">
        <div className="h-12 w-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-200 shrink-0">
          <img
            src={member.image || "/placeholder-user.png"}
            alt={member.name}
            className="object-cover w-full h-full"
          />
        </div>

        <div className="flex flex-col min-w-0">
          <span className="font-semibold text-gray-800 truncate">
            {member.name}
          </span>
          <span className="text-xs text-gray-500 truncate">
            {member.email || "No email"}
          </span>
        </div>
      </td>

      <td className="px-8 py-5">
        <div className="text-gray-700 font-medium">{member.role}</div>
        <div className="text-sm text-gray-500 mt-1">{member.memberType}</div>
      </td>

      <td className="px-8 py-5 text-right space-x-2">
        <button
          onClick={() => handleEdit(member)}
          className="p-2 text-cyan-600 cursor-pointer hover:bg-cyan-50 rounded-lg transition"
        >
          <Pencil size={18} />
        </button>

        <button
          onClick={() => handleDelete(member)}
          className="p-2 text-rose-600 cursor-pointer hover:bg-rose-50 rounded-lg transition"
        >
          <Trash2 size={18} />
        </button>
      </td>
    </tr>
  );
};

/* ---------------- MAIN PAGE ---------------- */
export default function AdminTeamPage() {
  const { team, setTeam, loading, refresh } = useTeam();
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);

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

      const payload = newOrder.map((m, i) => ({
        id: m.id,
        order: i,
      }));

      const res = await reorderTeam(payload);

      if (!res.success) {
        toast.error("Failed to save order");
        refresh();
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

    if (result.isConfirmed) {
      const res = await moveTeamToTrash(member.id);
      if (res.success) {
        toast.success("Moved to Trash");
        refresh();
      }
    }
  };

  const handleFormSubmit = async (formData: FormData) => {
    setIsSubmitting(true);

    try {
      if (editingMember?.id) formData.append("id", editingMember.id);

      const res = await upsertTeam(formData);

      if (res.success) {
        toast.success(editingMember ? "Updated" : "Added");
        setShowForm(false);
        setEditingMember(null);
        refresh();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && team.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4 bg-white">
        <Loader2 className="animate-spin text-emerald-500" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-8 min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl border border-gray-200 shadow-sm gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-xl">
            <Users className="text-emerald-600" size={28} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Team Management
            </h1>
            <p className="text-gray-500 text-sm">
              Manage your organization's core members
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            href="/admin/dashboard/team/trash"
            className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-xl font-semibold"
          >
            <Trash2 size={18} /> Trash
          </Link>

          <button
            onClick={() => {
              setEditingMember(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold cursor-pointer"
          >
            <Plus size={20} /> Add Member
          </button>
        </div>
      </div>

      {/* FORM / TABLE */}
      <AnimatePresence mode="wait">
        {showForm ? (
          <motion.div key="form">
            <TeamForm
              initialData={editingMember}
              isSubmitting={isSubmitting}
              onClose={() => {
                setShowForm(false);
                setEditingMember(null);
              }}
              onSubmit={handleFormSubmit}
            />
          </motion.div>
        ) : (
          <motion.div key="table">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                      <tr>
                        <th className="px-4 py-5 w-10"></th>
                        <th className="px-4 py-5">Team</th>
                        <th className="px-8 py-5">Role</th>
                        <th className="px-8 py-5 text-right">Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      <SortableContext
                        items={team.map((m) => m.id)}
                        strategy={verticalListSortingStrategy}
                      >
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
                </div>
              </DndContext>

              {team.length === 0 && (
                <div className="p-12 text-center text-gray-500">
                  No members found.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}