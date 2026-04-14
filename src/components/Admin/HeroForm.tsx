"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { updateHeroContent } from "@/app/ServerActions/Hero";
import { toast } from "sonner";
import { X, Loader2 } from "lucide-react";

type HeroFormProps = {
  initialData: any;
};

export default function HeroForm({ initialData }: HeroFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty, isSubmitting },
  } = useForm();

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [hasImageChanges, setHasImageChanges] = useState(false);

  useEffect(() => {
    if (initialData) {
      const normalizedData = { ...initialData, id: "singleton" };
      reset(normalizedData);
      setExistingImages(normalizedData.images || []);
      setPreviewImages(normalizedData.images || []);
      setNewFiles([]);
      setHasImageChanges(false);
    }
  }, [initialData, reset]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setNewFiles((prev) => [...prev, ...files]);
    const previews = files.map((f) => URL.createObjectURL(f));
    setPreviewImages((prev) => [...prev, ...previews]);
    setHasImageChanges(true);
  }

  function handleRemoveImage(index: number) {
    const image = previewImages[index];

    if (image.startsWith("blob:")) URL.revokeObjectURL(image);

    setPreviewImages((prev) => prev.filter((_, i) => i !== index));

    if (existingImages.includes(image)) {
      setExistingImages((prev) => prev.filter((img) => img !== image));
    } else {
      const blobIndex = previewImages.length - newFiles.length;
      const newIndex = index - blobIndex;
      if (newIndex >= 0) {
        setNewFiles((prev) => prev.filter((_, i) => i !== newIndex));
      }
    }

    setHasImageChanges(true);
  }

  async function onSubmit(data: any) {
    const toastId = toast.loading("Saving changes...");

    try {
      const formData = new FormData();

      formData.append("id", "singleton");
      formData.append("badgeText", data.badgeText || "");
      formData.append("headline", data.headline || "");
      formData.append("description", data.description || "");
      formData.append("livesImpacted", data.livesImpacted || "");
      formData.append("projectsCount", data.projectsCount || "");
      formData.append("yearsActive", data.yearsActive || "");
      formData.append("donateLink", data.donateLink || "");

      formData.append("existingImages", JSON.stringify(existingImages));
      newFiles.forEach((file) => formData.append("images", file));

      const res = await updateHeroContent(formData);

      if (res.success) {
        toast.success("Updated successfully!", { id: toastId });
        setNewFiles([]);
        setHasImageChanges(false);
        reset({ ...data, images: existingImages, id: "singleton" });
      } else {
        toast.error(res.error || "Failed", { id: toastId });
      }
    } catch {
      toast.error("Something went wrong", { id: toastId });
    }
  }

  // ✅ Light styles
  const inputStyle =
    "w-full bg-white border border-slate-300 rounded-lg p-3 text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition";

  const labelStyle = "block text-base font-semibold text-slate-700 mb-2";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className={labelStyle}>Badge Text</label>
          <input {...register("badgeText")} className={inputStyle} />
        </div>

        <div>
          <label className={labelStyle}>Headline</label>
          <input {...register("headline")} className={inputStyle} />
        </div>
      </div>

      <div>
        <label className={labelStyle}>Description</label>
        <textarea {...register("description")} rows={4} className={inputStyle} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className={labelStyle}>Donate Link</label>
          <input type="url" {...register("donateLink")} className={inputStyle} />
        </div>

        <div>
          <label className={labelStyle}>Lives Impacted</label>
          <input {...register("livesImpacted")} className={inputStyle} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className={labelStyle}>Projects Count</label>
          <input {...register("projectsCount")} className={inputStyle} />
        </div>

        <div>
          <label className={labelStyle}>Years Active</label>
          <input {...register("yearsActive")} className={inputStyle} />
        </div>
      </div>

      {/* Upload */}
      <div>
        <label className={labelStyle}>Hero Gallery Images</label>

        <label className="relative flex items-center justify-center h-32 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-emerald-500 transition group bg-slate-50">
          <span className="text-slate-400 group-hover:text-emerald-600">
            Click to upload images
          </span>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </label>
      </div>

      {/* Preview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {previewImages.map((img, i) => (
          <div key={i} className="relative rounded-lg overflow-hidden border border-slate-200 group aspect-video">
            <img src={img} className="h-full w-full object-cover" />

            <button
              type="button"
              onClick={() => handleRemoveImage(i)}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500 text-white opacity-100 md:opacity-0 md:group-hover:opacity-100 transition"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={(!isDirty && !hasImageChanges) || isSubmitting}
        className={`w-full font-semibold py-4 cursor-pointer rounded-xl flex items-center justify-center gap-2 transition ${
          (!isDirty && !hasImageChanges) || isSubmitting
            ? "bg-slate-200 text-slate-400 cursor-not-allowed"
            : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-md"
        }`}
      >
        {isSubmitting && <Loader2 className="animate-spin" size={18} />}
        {isSubmitting ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}