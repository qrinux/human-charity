"use client";

import React, { useState } from "react";
import { Plus, Pencil, Trash2, Loader2, MapPin} from "lucide-react";
import { motion } from "motion/react";
import { useProjects } from "@/components/Hooks/useProjects";
import { softDeleteProject, upsertProject } from "@/app/ServerActions/project";
import { ProjectForm } from "./ProjectForm";
import { ProgressBar } from "@/components/Hooks/ProgressBar";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function AdminProjectsPage() {
  const router = useRouter();
  const { projects, loading, refresh } = useProjects();

  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);

  const handleEdit = (project: any) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const confirmDelete = async (id: string) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "This project will be moved to trash!",
    showCancelButton: true,
    confirmButtonColor: "#e11d48",
    cancelButtonColor: "#64748b",
    confirmButtonText: "Yes, delete it!",
  });

  if (result.isConfirmed) {
    executeDelete(id); // call softDeleteProject
  }
};

  const executeDelete = async (id: string) => {
  const res = await softDeleteProject(id);
  if (res.success) {
    toast.success("Project moved to trash");
    refresh(); // refresh list
  } else {
    toast.error("Failed to delete project");
  }
};

  const handleFormSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      if (editingProject?.id) formData.append("id", editingProject.id);

      const res = await upsertProject(formData);
      if (res.success) {
        toast.success(editingProject ? "Project updated" : "Project created");
        setShowForm(false);
        setEditingProject(null);
        refresh();
      } else toast.error(res.error || "Error saving project");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && projects.length === 0)
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <Loader2 className="animate-spin text-emerald-500" size={40} />
      </div>
    );

  return (
  <div className="space-y-6">
    
    {/* Header */}
    <div className="flex justify-between items-center flex-wrap gap-4">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
          Project Management
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Create, update, or remove initiatives.
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => router.push("/admin/dashboard/projects/trash")}
          className="flex items-center cursor-pointer gap-2 bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-xl font-semibold shadow-sm"
        >
          <Trash2 size={18} /> Trash
        </button>

        <button
          onClick={() => {
            setEditingProject(null);
            setShowForm(true);
          }}
          className="flex items-center cursor-pointer gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm"
        >
          <Plus size={20} /> New Project
        </button>
      </div>
    </div>

    {/* Form */}
    {showForm ? (
      <ProjectForm
        initialData={editingProject}
        isSubmitting={isSubmitting}
        onClose={() => setShowForm(false)}
        onSubmit={handleFormSubmit}
      />
    ) : (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm"
      >

        <div className="hidden md:block">
          <table className="w-full text-left border-separate border-spacing-0">
        
            <thead className="bg-slate-50 text-slate-500 text-[12px] uppercase font-semibold tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-8 py-4">Initiative</th>
                <th className="px-8 py-4">Location</th>
                <th className="px-8 py-4">Completion</th>
                <th className="px-8 py-4 text-right">Manage</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-slate-200">
              {projects.map((project) => (
                <tr
                  key={project.id}
                  className="hover:bg-slate-50 transition"
                >
                  <td className="px-8 py-5 flex items-center gap-4">
                    <div className="h-10 w-16 rounded-lg overflow-hidden border border-slate-200">
                      <img
                        src={project.image}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <span className="font-semibold text-slate-800">
                      {project.title.split(' ').slice(0, 3).join(' ')}
  {project.title.split(' ').length > 3 ? '...' : ''}
                    </span>
                  </td>

                  <td className="px-8 py-5 text-slate-500 text-sm">
                    {project.location}
                  </td>

                  <td className="px-8 py-5">
                    <ProgressBar
                      progress={project.progress}
                      showText
                      className="w-32"
                    />
                  </td>

                  <td className="px-8 py-5 text-right space-x-2">
                    <button
                      onClick={() => handleEdit(project)}
                      className="p-2 text-blue-500 cursor-pointer hover:bg-blue-50 rounded-lg"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => confirmDelete(project.id)}
                      className="p-2 text-rose-500 cursor-pointer hover:bg-rose-50 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="md:hidden flex flex-col gap-4 p-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-3 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="h-16 w-20 rounded-lg overflow-hidden border border-slate-200">
                  <img src={project.image} className="object-cover w-full h-full" />
                </div>

                <div className="flex-1">
                  <h2 className="font-semibold text-slate-800">
  {project.title.split(' ').slice(0, 3).join(' ')}
  {project.title.split(' ').length > 3 ? '...' : ''}
</h2>

                  <div className="flex items-center gap-1 text-slate-500 text-sm mt-1">
                    <MapPin size={14} className="text-emerald-500" />
                    {project.location}
                  </div>

                  <div className="mt-2">
                    <ProgressBar progress={project.progress} showText />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => handleEdit(project)}
                  className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                >
                  <Pencil size={18} />
                </button>

                <button
                  onClick={() => confirmDelete(project.id)}
                  className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {projects.length === 0 && !loading && (
          <div className="p-24 text-center">
            <div className="text-slate-400 mb-2 text-4xl">📭</div>
            <p className="text-slate-500 text-sm">
              Your impact history is currently empty.
            </p>
          </div>
        )}
      </motion.div>
    )}
  </div>
);
}