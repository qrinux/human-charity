"use client";

import Image from "next/image";
import React, { useEffect, useMemo, useRef, useState } from "react";
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

const MAX_GALLERY_IMAGES = 12;
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const MAX_IMAGE_SIZE_LABEL = "5MB";

interface GalleryFormData {
  id?: string;
  title: string;
  category: string;
  description: string;
  date: string;
}

interface GalleryImage {
  id: number;
  url: string;
}

interface GalleryCategoryItem {
  category: string;
  categorySlug: string;
}

interface GalleryFormInitialData {
  id?: number | string;
  title?: string;
  category?: string;
  description?: string;
  date?: string | Date;
  images?: GalleryImage[];
  allItems?: GalleryCategoryItem[];
}

interface GalleryFormProps {
  initialData?: GalleryFormInitialData;
  onSubmit: (data: FormData) => Promise<void>;
  onClose: () => void;
  isSubmitting: boolean;
}

interface PendingUpload {
  id: string;
  file: File;
  url: string;
  isAllowed: boolean;
  reason?: string;
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

  const [existingImages, setExistingImages] = useState<GalleryImage[]>(
    initialData?.images ?? []
  );
  const [pendingUploads, setPendingUploads] = useState<PendingUpload[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const pendingUploadsRef = useRef<PendingUpload[]>([]);

  const allowedUploads = useMemo(
    () => pendingUploads.filter((upload) => upload.isAllowed),
    [pendingUploads]
  );

  useEffect(() => {
    pendingUploadsRef.current = pendingUploads;
  }, [pendingUploads]);

  useEffect(() => {
    return () => {
      pendingUploadsRef.current.forEach((upload) => {
        URL.revokeObjectURL(upload.url);
      });
    };
  }, []);

  const categories = (() => {
    const seen = new Map<string, string>();

    (initialData?.allItems ?? []).forEach((item) => {
      if (item.category && !seen.has(item.categorySlug)) {
        seen.set(item.categorySlug, item.category);
      }
    });

    return Array.from(seen.values());
  })();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) {
      return;
    }

    const nextUploads: PendingUpload[] = [];
    let availableSlots = MAX_GALLERY_IMAGES - (existingImages.length + allowedUploads.length);

    if (availableSlots <= 0) {
      setUploadError(`You can upload up to ${MAX_GALLERY_IMAGES} images per album.`);
      e.target.value = "";
      return;
    }

    const messages: string[] = [];

    files.forEach((file) => {
      const upload: PendingUpload = {
        id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
        file,
        url: URL.createObjectURL(file),
        isAllowed: true,
      };

      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        upload.isAllowed = false;
        upload.reason = `File is larger than ${MAX_IMAGE_SIZE_LABEL}.`;
      } else if (availableSlots <= 0) {
        upload.isAllowed = false;
        upload.reason = `Album limit reached. Only ${MAX_GALLERY_IMAGES} images are allowed.`;
      } else {
        availableSlots -= 1;
      }

      nextUploads.push(upload);
    });

    if (nextUploads.some((upload) => upload.reason === `File is larger than ${MAX_IMAGE_SIZE_LABEL}.`)) {
      messages.push(`Each image must be ${MAX_IMAGE_SIZE_LABEL} or smaller.`);
    }

    if (nextUploads.some((upload) => upload.reason?.startsWith("Album limit reached."))) {
      const remainingSlots = MAX_GALLERY_IMAGES - (existingImages.length + allowedUploads.length);
      messages.push(`Only ${remainingSlots} more image${remainingSlots === 1 ? " is" : "s are"} allowed in this album.`);
    }

    setPendingUploads((prev) => [...prev, ...nextUploads]);

    setUploadError(messages.length > 0 ? messages.join(" ") : null);
    e.target.value = "";
  };

  const removeExistingImage = (id: number) => {
    setUploadError(null);
    setExistingImages((prev) => prev.filter((img) => img.id !== id));
  };

  const removeNewFile = (index: number) => {
    setUploadError(null);
    setPendingUploads((prev) => {
      const uploadToRemove = prev[index];

      if (uploadToRemove) {
        URL.revokeObjectURL(uploadToRemove.url);
      }

      return prev.filter((_, currentIndex) => currentIndex !== index);
    });
  };

  const handleFormSubmit = async (values: GalleryFormData) => {
    const totalImages = existingImages.length + allowedUploads.length;

    if (totalImages === 0) {
      setUploadError("Please upload at least one image.");
      return;
    }

    if (totalImages > MAX_GALLERY_IMAGES) {
      setUploadError(`You can upload up to ${MAX_GALLERY_IMAGES} images per album.`);
      return;
    }

    if (pendingUploads.some((upload) => !upload.isAllowed)) {
      setUploadError("Remove the images marked as not allowed before publishing.");
      return;
    }

    setUploadError(null);

    const data = new FormData();

    if (initialData?.id) data.append("id", initialData.id.toString());

    data.append("title", values.title);
    data.append("category", values.category);
    data.append("description", values.description);
    data.append("date", values.date);

    // Slug is generated server-side automatically — no need to pass it from the form

    allowedUploads.forEach((upload) => data.append("images", upload.file));

    const removedIds = initialData?.images
      ?.map((img) => img.id)
      .filter((id) => !existingImages.find((img) => img.id === id));

    removedIds?.forEach((id) => data.append("removedImages[]", id.toString()));

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
              className={`w-full bg-white border ${errors.title ? "border-rose-500" : "border-slate-300"
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
              className={`w-full bg-white border ${errors.category ? "border-rose-500" : "border-slate-300"
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
                <Image
                  src={img.url}
                  alt=""
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                />
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

        {pendingUploads.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
            {pendingUploads.map((upload, index) => (
              <div
                key={upload.id}
                className={`relative group h-28 md:h-32 rounded-lg overflow-hidden border ${upload.isAllowed ? "border-slate-200" : "border-rose-400"
                  }`}
              >
                <Image
                  src={upload.url}
                  alt=""
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className={`object-cover ${upload.isAllowed ? "" : "grayscale opacity-60"}`}
                />
                {!upload.isAllowed && (
                  <>
                    <div className="absolute inset-0 bg-rose-950/30" />
                    <div className="absolute left-2 top-2 rounded-full bg-rose-500 px-2 py-1 text-[10px] font-bold text-white">
                      Not allowed
                    </div>
                    <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-rose-950/90 via-rose-950/60 to-transparent p-2">
                      <p className="text-[10px] font-semibold text-white line-clamp-2">
                        {upload.reason}
                      </p>
                    </div>
                  </>
                )}
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

        <label
          className={`flex flex-col items-center justify-center h-32 md:h-40 border-2 border-dashed rounded-xl transition bg-white ${existingImages.length + allowedUploads.length >= MAX_GALLERY_IMAGES
            ? "border-slate-200 cursor-not-allowed opacity-60"
            : "border-slate-300 cursor-pointer hover:border-emerald-500"
            }`}
        >
          <Upload className="text-slate-500 mb-2" />
          <span className="text-slate-600 font-medium">Upload Photos</span>
          <span className="text-xs text-slate-500 mt-1">
            Up to {MAX_GALLERY_IMAGES} images, {MAX_IMAGE_SIZE_LABEL} each
          </span>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            disabled={existingImages.length + allowedUploads.length >= MAX_GALLERY_IMAGES}
            className="hidden"
          />
        </label>

        <div className="space-y-1">
          <p className="text-xs text-slate-500">
            {existingImages.length + allowedUploads.length}/{MAX_GALLERY_IMAGES} images selected
          </p>
          {pendingUploads.some((upload) => !upload.isAllowed) && (
            <p className="text-xs font-semibold text-amber-600">
              {pendingUploads.filter((upload) => !upload.isAllowed).length} image{pendingUploads.filter((upload) => !upload.isAllowed).length === 1 ? " is" : "s are"} not allowed and will not be uploaded.
            </p>
          )}
          {uploadError && (
            <p className="text-xs font-semibold text-rose-500">{uploadError}</p>
          )}
        </div>

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