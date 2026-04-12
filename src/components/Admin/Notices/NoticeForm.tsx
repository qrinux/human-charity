"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { X, Trash2, Loader2, Upload, FileText, ChevronDown } from "lucide-react";
import { motion } from "motion/react";

interface NoticeFormData {
  id?: string;
  slug: string;
  date: string;
  title: string;
  description: string;
  excerpt: string;
  content: string;
  type: string;
  latest: boolean;
}

interface NoticeFormProps {
  initialData?: any;
  onSubmit: (data: FormData) => Promise<void>;
  onClose: () => void;
  isSubmitting: boolean;
}

export default function NoticeForm({
  initialData,
  onSubmit,
  onClose,
  isSubmitting,
}: NoticeFormProps) {
  const formatDateForInput = (dateInput: any) => {
    if (!dateInput) return "";
    const d = new Date(dateInput);
    return d.toISOString().split("T")[0];
  };

  const { register, handleSubmit } = useForm<NoticeFormData>({
    defaultValues: {
      id: initialData?.id || "",
      slug: initialData?.slug || "",
      title: initialData?.title || "",
      date: formatDateForInput(initialData?.date),
      description: initialData?.description || "",
      excerpt: initialData?.excerpt || "",
      content: initialData?.content || "",
      type: initialData?.type || "notice",
      latest: initialData?.latest || false,
    },
  });


  const [previewImage, setPreviewImage] = useState<string>(initialData?.image || "");
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
  };

  /* ---------- SUBMIT ---------- */

  const handleFormSubmit = async (values: NoticeFormData) => {
    const data = new FormData();

    if (initialData?.id) {
      data.append("id", initialData.id);
    }

    data.append("title", values.title);
    data.append("slug", values.slug);
    data.append("date", values.date);
    data.append("description", values.description);
    data.append("excerpt", values.excerpt);
    data.append("content", values.content);
    data.append("type", values.type);
    data.append("latest", values.latest.toString());

    if (newFile) {
      data.append("image", newFile);
    } else {
      data.append("existingImage", initialData?.image || "");
    }

    await onSubmit(data);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl max-w-4xl mx-auto"
    >
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-5">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <FileText className="text-emerald-600" />
          {initialData ? "Update Notice" : "Create Notice"}
        </h2>

        <button
          onClick={onClose}
          className="text-white p-2 hover:bg-red-600 bg-red-500 rounded-full transition-all cursor-pointer shadow-sm"
        >
          <X size={22} />
        </button>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

  {/* TITLE */}
  <div className="space-y-2">
    <label className="text-xs font-bold uppercase text-slate-500 ml-1">
      Title
    </label>
    <input
      {...register("title", { required: true })}
      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
    />
  </div>

  {/* DATE */}
  <div className="space-y-2">
    <label className="text-xs font-bold uppercase text-slate-500 ml-1">
      Date
    </label>
    <input
      type="date"
      {...register("date", { required: true })}
      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 outline-none cursor-pointer focus:border-emerald-500 transition-all"
    />
  </div>

  {/* TYPE */}
  <div className="space-y-2">
    <label className="text-xs font-bold uppercase text-slate-500 ml-1">
      Notice Type
    </label>
    <div className="relative">
      <select
        {...register("type")}
        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pr-10 text-slate-800 outline-none appearance-none cursor-pointer focus:border-emerald-500 transition-all"
      >
        <option value="notice">Latest Notice</option>
        <option value="urgent">Urgent Announcement</option>
        <option value="success">Success Story</option>
      </select>
      <ChevronDown
        size={18}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
      />
    </div>
  </div>

  {/* MARK AS FEATURED - FIXED SIZE & ALIGNMENT */}
  <div className="space-y-2 flex flex-col justify-end">
    {/* Empty label or "Status" label to keep alignment perfect with other inputs */}
    <label className="text-xs font-bold uppercase text-slate-500 ml-1">
      Visibility
    </label>
    <div className="flex items-center gap-3 bg-slate-50 p-3 h-[50px] rounded-xl border border-slate-200 hover:border-emerald-500 transition-colors cursor-pointer">
      <input
        id="latest-checkbox"
        type="checkbox"
        {...register("latest")}
        className="w-5 h-5 accent-emerald-600 cursor-pointer"
      />
      <label htmlFor="latest-checkbox" className="text-sm font-medium text-slate-600 cursor-pointer select-none">
        Mark as Featured
      </label>
    </div>
  </div>

</div>

        {/* TEXT AREAS */}
        {[
          { id: "description", label: "Description", rows: 2 },
          { id: "content", label: "Content", rows: 5 },
        ].map((field) => (
          <div key={field.id} className="space-y-2">
            <label className="text-xs font-bold uppercase text-slate-500 ml-1">
              {field.label}
            </label>
            <textarea
              rows={field.rows}
              {...register(field.id as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 outline-none focus:border-emerald-500 transition-all"
            />
          </div>
        ))}
        {/* IMAGE UPLOAD */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-slate-500 ml-1">
            Cover Image
          </label>
          {previewImage ? (
            <div className="relative h-64 rounded-xl overflow-hidden border border-slate-200 shadow-inner">
              <img
                src={previewImage}
                className="w-full h-full object-cover"
                alt="Preview"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 p-2 rounded-full text-white shadow-lg transition-colors cursor-pointer"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/30 transition-all bg-slate-50 group">
              <Upload className="text-slate-400 mb-2 group-hover:text-emerald-500 transition-colors" />
              <span className="text-slate-500 font-medium group-hover:text-emerald-600">Upload Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold py-4 rounded-xl flex justify-center items-center transition-all cursor-pointer shadow-md hover:shadow-lg active:scale-[0.99]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin mr-2" />
              Saving...
            </>
          ) : initialData ? (
            "Update Notice"
          ) : (
            "Publish Notice"
          )}
        </button>
      </form>
    </motion.div>
  );
}