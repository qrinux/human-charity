"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  X,
  Trash2,
  Loader2,
  Upload,
  ImageIcon,
  Tag,
  Calendar,
  AlignLeft,
} from "lucide-react";
import { motion } from "motion/react";

interface GalleryFormData {
  id?: string;
  title: string;
  category: string;
  description: string;
  date: string;
}

interface GalleryFormProps {
  initialData?: any;
  onSubmit: (data: FormData) => Promise<void>;
  onClose: () => void;
  isSubmitting: boolean;
}

export default function GalleryForm({
  initialData,
  onSubmit,
  onClose,
  isSubmitting,
}: GalleryFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GalleryFormData>({
    defaultValues: {
      id: initialData?.id?.toString() || "",
      title: initialData?.title || "",
      category: initialData?.category || "",
      description: initialData?.description || "",
      date: initialData?.date
        ? new Date(initialData.date).toISOString().split("T")[0]
        : "",
    },
  });

  const [existingImages, setExistingImages] = useState<any[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    if (initialData?.images) {
      setExistingImages(initialData.images);
    }
  }, [initialData]);

  useEffect(() => {
    if (initialData?.allItems) {
      // Deduplicate by category name (original Bengali is fine here — it's for display)
      const seen = new Map<string, string>();
      (initialData.allItems as any[]).forEach((item) => {
        if (item.category && !seen.has(item.categorySlug)) {
          seen.set(item.categorySlug, item.category);
        }
      });
      setCategories(Array.from(seen.values()));
    }
  }, [initialData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewFiles((prev) => [...prev, ...files]);
  };

  const removeExistingImage = (id: string) => {
    setExistingImages((prev) => prev.filter((img) => img.id !== id));
  };

  const removeNewFile = (index: number) => {
    const updated = [...newFiles];
    updated.splice(index, 1);
    setNewFiles(updated);
  };

  const handleFormSubmit = async (values: GalleryFormData) => {
    if (existingImages.length === 0 && newFiles.length === 0) {
      alert("Please upload at least one image");
      return;
    }

    const data = new FormData();

    if (initialData?.id) data.append("id", initialData.id.toString());

    data.append("title", values.title);
    data.append("category", values.category);
    data.append("description", values.description);
    data.append("date", values.date);

    // Slug is generated server-side automatically — no need to pass it from the form

    newFiles.forEach((file) => data.append("images", file));

    const removedIds = initialData?.images
      ?.map((img: any) => img.id)
      .filter((id: any) => !existingImages.find((img) => img.id === id));

    removedIds?.forEach((id: any) => data.append("removedImages[]", id));

    await onSubmit(data);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white p-5 md:p-8 rounded-2xl border border-slate-200 shadow-xl max-w-4xl mx-auto"
    >
      <div className="flex justify-between items-center mb-8 border-b border-slate-200 pb-5">
        <h2 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2">
          <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
            <ImageIcon size={20} />
          </div>
          {initialData?.title ? "Edit Gallery Album" : "Add Gallery Album"}
        </h2>
        <button
          onClick={onClose}
          className="text-white p-2 hover:bg-red-500/20 bg-red-500 rounded-full transition-all cursor-pointer"
        >
          <X size={22} />
        </button>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-bold uppercase text-slate-500 flex items-center gap-2">
              <ImageIcon size={14} className="text-emerald-600" />
              Album Title
            </label>
            <input
              {...register("title", { required: "Title is required" })}
              placeholder="খাদ্য বিতরণ সিলেট ২০২৪"
              className={`w-full bg-white border ${
                errors.title ? "border-rose-500" : "border-slate-300"
              } rounded-xl p-3 text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500/50`}
            />
            {errors.title && (
              <p className="text-rose-500 text-[10px] font-bold">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-slate-500 flex items-center gap-2">
              <Tag size={14} className="text-emerald-600" /> Album Category
            </label>
            <input
              list="category-options"
              {...register("category", { required: "Category is required" })}
              placeholder="খাদ্য বিতরণ"
              className={`w-full bg-white border ${
                errors.category ? "border-rose-500" : "border-slate-300"
              } rounded-xl p-3 text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500/50`}
            />
            <datalist id="category-options">
              {categories.map((cat, i) => (
                <option key={i} value={cat} />
              ))}
            </datalist>
            {errors.category && (
              <p className="text-rose-500 text-[10px] font-bold">{errors.category.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-slate-500 flex items-center gap-2">
              <Calendar size={14} /> Event Date
            </label>
            <input
              type="date"
              {...register("date", { required: true })}
              className="w-full bg-white border border-slate-300 rounded-xl p-3 text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer"
            />
          </div>

        </div>

        {existingImages.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
            {existingImages.map((img) => (
              <div key={img.id} className="relative group h-28 md:h-32 rounded-lg overflow-hidden">
                <img src={img.url} className="w-full h-full object-cover" alt="" />
                <button
                  type="button"
                  onClick={() => removeExistingImage(img.id)}
                  className="absolute top-2 right-2 bg-rose-500 text-white p-1.5 rounded-full cursor-pointer"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {newFiles.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
            {newFiles.map((file, index) => (
              <div key={index} className="relative group h-28 md:h-32 rounded-lg overflow-hidden">
                <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="" />
                <button
                  type="button"
                  onClick={() => removeNewFile(index)}
                  className="absolute top-2 right-2 bg-rose-500 text-white p-1.5 rounded-full cursor-pointer"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        <label className="flex flex-col items-center justify-center h-32 md:h-40 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-emerald-500 transition bg-white">
          <Upload className="text-slate-500 mb-2" />
          <span className="text-slate-600 font-medium">Upload Photos</span>
          <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
        </label>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-slate-500 flex items-center gap-2">
            <AlignLeft size={14} className="text-emerald-600" /> Caption
          </label>
          <textarea
            rows={3}
            {...register("description")}
            placeholder="Describe this event..."
            className="w-full bg-white border border-slate-300 rounded-xl p-3 text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold py-4 rounded-xl flex justify-center items-center transition cursor-pointer"
        >
          {isSubmitting ? (
            <><Loader2 className="animate-spin mr-2" />Uploading...</>
          ) : initialData?.title ? (
            "Update Gallery Album"
          ) : (
            "Publish Gallery Album"
          )}
        </button>

      </form>
    </motion.div>
  );
}