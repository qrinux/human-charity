"use client";

import React, { useState } from "react";
import { X, Loader2, Plus, Trash2, Target, Upload } from "lucide-react";
import { motion } from "motion/react";

interface ProjectFormData {
  title: string;
  location: string;
  description: string;
  fullDescription: string;
  image: string;
  progress: number;
  beneficiaries: string;
  timeline: string;
  objectives: string[];
  impact: string[];
}

interface ProjectFormProps {
  initialData?: any;
  onSubmit: (data: FormData) => Promise<void>;
  onClose: () => void;
  isSubmitting: boolean;
}

export const ProjectForm = ({
  initialData,
  onSubmit,
  onClose,
  isSubmitting,
}: ProjectFormProps) => {
  const [formData, setFormData] = useState<ProjectFormData>({
    title: initialData?.title || "",
    location: initialData?.location || "",
    description: initialData?.description || "",
    fullDescription: initialData?.fullDescription || "",
    image: initialData?.image || "",
    progress: initialData?.progress || 0,
    beneficiaries: initialData?.beneficiaries || "",
    timeline: initialData?.timeline || "",
    objectives:
      initialData?.objectives?.length > 0
        ? [...initialData.objectives]
        : [""],
    impact:
      initialData?.impact?.length > 0 ? [...initialData.impact] : [""],
  });

  const [previewImage, setPreviewImage] = useState<string>(
    initialData?.image || ""
  );
  const [newFile, setNewFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setNewFile(null);
    setPreviewImage("");
    setFormData({ ...formData, image: "" });
  };

  const handleArrayChange = (
    index: number,
    value: string,
    type: "objectives" | "impact"
  ) => {
    const arr = [...formData[type]];
    arr[index] = value;
    setFormData({ ...formData, [type]: arr });
  };

  const addArrayField = (type: "objectives" | "impact") => {
    setFormData({ ...formData, [type]: [...formData[type], ""] });
  };

  const removeArrayField = (
    index: number,
    type: "objectives" | "impact"
  ) => {
    if (formData[type].length <= 1) return;
    setFormData({
      ...formData,
      [type]: formData[type].filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("location", formData.location);
    data.append("description", formData.description);
    data.append("fullDescription", formData.fullDescription);
    data.append("progress", formData.progress.toString());
    data.append("beneficiaries", formData.beneficiaries);
    data.append("timeline", formData.timeline);
    data.append(
      "objectives",
      JSON.stringify(formData.objectives.filter((s) => s.trim()))
    );
    data.append(
      "impact",
      JSON.stringify(formData.impact.filter((s) => s.trim()))
    );

    if (newFile) data.append("image", newFile);
    else data.append("existingImage", formData.image);

    onSubmit(data);
  };

  const inputStyle =
    "w-full bg-white border border-slate-300 rounded-lg p-3 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 outline-none transition";

  const labelStyle =
    "text-sm font-semibold uppercase text-slate-500 tracking-wide";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-8 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
            <Target size={22} />
          </div>
          <h2 className="text-xl font-bold text-slate-800">
            {initialData ? "Update Project" : "New Initiative"}
          </h2>
        </div>

        <button
          onClick={onClose}
          className="p-2 bg-red-600 cursor-pointer hover:bg-rose-500 text-white rounded-full transition"
        >
          <X size={20} />
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Title */}
        <div>
          <label className={labelStyle}>Project Title</label>
          <input
            required
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className={inputStyle}
          />
        </div>

        {/* Location */}
        <div>
          <label className={labelStyle}>Location</label>
          <input
            required
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            className={inputStyle}
          />
        </div>

        {/* Image */}
        <div className="md:col-span-2">
          <label className={labelStyle}>Cover Image</label>

          {previewImage ? (
            <div className="relative h-56 rounded-xl overflow-hidden border border-slate-200 group">
              <img src={previewImage} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="bg-rose-500 cursor-pointer text-white p-3 rounded-full"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center h-56 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-emerald-500 bg-slate-50">
              <Upload size={28} className="text-slate-400 mb-2" />
              <span className="text-slate-500">Upload image</span>
              <input type="file" onChange={handleFileChange} hidden />
            </label>
          )}
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className={labelStyle}>Short Description</label>
          <textarea
            rows={2}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className={inputStyle}
          />
        </div>

        <div className="md:col-span-2">
          <label className={labelStyle}>Full Description</label>
          <textarea
            rows={4}
            value={formData.fullDescription}
            onChange={(e) =>
              setFormData({
                ...formData,
                fullDescription: e.target.value,
              })
            }
            className={inputStyle}
          />
        </div>

        {/* Stats */}
        <div>
          <label className={labelStyle}>Progress (%)</label>
          <input
            type="number"
            max="100"
            value={formData.progress}
            onChange={(e) =>
              setFormData({
                ...formData,
                progress: parseInt(e.target.value) || 0,
              })
            }
            className={inputStyle}
          />
        </div>

        <div>
          <label className={labelStyle}>Timeline</label>
          <input
            value={formData.timeline}
            onChange={(e) =>
              setFormData({ ...formData, timeline: e.target.value })
            }
            className={inputStyle}
          />
        </div>

        <div className="md:col-span-2">
          <label className={labelStyle}>Beneficiaries</label>
          <input
            value={formData.beneficiaries}
            onChange={(e) =>
              setFormData({
                ...formData,
                beneficiaries: e.target.value,
              })
            }
            className={inputStyle}
          />
        </div>

        {/* Dynamic fields */}
        {(["objectives", "impact"] as const).map((type) => (
          <div
            key={type}
            className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200"
          >
            <div className="flex justify-between">
              <label className={labelStyle}>{type}</label>
              <button
                type="button"
                onClick={() => addArrayField(type)}
                className="text-emerald-600 text-xs flex cursor-pointer gap-1"
              >
                <Plus size={14} /> Add
              </button>
            </div>

            {formData[type].map((val, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={val}
                  onChange={(e) =>
                    handleArrayChange(i, e.target.value, type)
                  }
                  className={inputStyle}
                />
                <button
                  type="button"
                  onClick={() => removeArrayField(i, type)}
                  className="text-rose-500 cursor-pointer"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        ))}

        {/* Submit */}
        <button
          disabled={isSubmitting}
          className="md:col-span-2 bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-xl font-semibold flex justify-center items-center gap-2"
        >
          {isSubmitting && <Loader2 className="animate-spin" size={18} />}
          {initialData ? "Update Project" : "Publish Project"}
        </button>
      </form>
    </motion.div>
  );
};