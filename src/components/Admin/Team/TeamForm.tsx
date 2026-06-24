"use client";

import React, { useState } from "react";
import {
  X,
  Loader2,
  Plus,
  Trash2,
  Upload,
  Users,
  Link as LinkIcon,
  ChevronDown,
} from "lucide-react";
import { motion } from "motion/react";

interface TeamFormData {
  name: string;
  role: string;
  memberType: string;
  bio: string;
  expertise: string;
  email: string;
  linkedin: string;
  facebook: string;
  twitter: string;
  instagram: string;
  image: string;
  education: string[];
  experience: string[];
  achievements: string[];
}

interface TeamFormProps {
  initialData?: any;
  onSubmit: (data: FormData) => Promise<void>;
  onClose: () => void;
  isSubmitting: boolean;
}

export const TeamForm = ({
  initialData,
  onSubmit,
  onClose,
  isSubmitting,
}: TeamFormProps) => {
  const [formData, setFormData] = useState<TeamFormData>({
    name: initialData?.name || "",
    role: initialData?.role || "",
    memberType: initialData?.memberType || "member",
    bio: initialData?.bio || "",
    expertise: initialData?.expertise || "",
    email: initialData?.email || "",
    linkedin: initialData?.linkedin || "",
    facebook: initialData?.facebook || "",
    twitter: initialData?.twitter || "",
    instagram: initialData?.instagram || "",
    image: initialData?.image || "",
    education:
      initialData?.education?.length > 0
        ? [...initialData.education]
        : [""],
    experience:
      initialData?.experience?.length > 0
        ? [...initialData.experience]
        : [""],
    achievements:
      initialData?.achievements?.length > 0
        ? [...initialData.achievements]
        : [""],
  });

  const [previewImage, setPreviewImage] = useState(
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
    type: "education" | "experience" | "achievements"
  ) => {
    const newArr = [...formData[type]];
    newArr[index] = value;
    setFormData({ ...formData, [type]: newArr });
  };

  const addArrayField = (
    type: "education" | "experience" | "achievements"
  ) => {
    setFormData({ ...formData, [type]: [...formData[type], ""] });
  };

  const removeArrayField = (
    index: number,
    type: "education" | "experience" | "achievements"
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
    data.append("name", formData.name);
    data.append("role", formData.role);
    data.append("memberType", formData.memberType);
    data.append("bio", formData.bio);
    data.append("expertise", formData.expertise);
    data.append("email", formData.email);
    data.append("linkedin", formData.linkedin);
    data.append("facebook", formData.facebook);
    data.append("twitter", formData.twitter);
    data.append("instagram", formData.instagram);

    data.append(
      "education",
      JSON.stringify(formData.education.filter((s) => s.trim() !== ""))
    );
    data.append(
      "experience",
      JSON.stringify(formData.experience.filter((s) => s.trim() !== ""))
    );
    data.append(
      "achievements",
      JSON.stringify(formData.achievements.filter((s) => s.trim() !== ""))
    );

    if (newFile) data.append("image", newFile);
    else data.append("existingImage", formData.image);

    if (initialData?.id) data.append("id", initialData.id);

    onSubmit(data);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-lg max-w-4xl mx-auto"
    >
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
            <Users size={24} />
          </div>
          <h2 className="text-xl font-bold text-gray-800">
            {initialData ? "Update Member" : "New Team Member"}
          </h2>
        </div>

        <button
          onClick={onClose}
          className="p-2 bg-red-100 text-red-500 hover:bg-red-200 rounded-full transition cursor-pointer"
        >
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* NAME */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-gray-500">
            Full Name
          </label>
          <input
            required
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-emerald-400 outline-none"
          />
        </div>

        {/* ROLE */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-gray-500">
            Designation
          </label>
          <input
            required
            value={formData.role}
            onChange={(e) =>
              setFormData({ ...formData, role: e.target.value })
            }
            className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-emerald-400 outline-none"
          />
        </div>

        {/* MEMBER TYPE */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-gray-500">
            Member Type
          </label>

          <div className="relative ">
            <select
              value={formData.memberType}
              onChange={(e) =>
                setFormData({ ...formData, memberType: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg p-3 mr-10 text-gray-800 outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer "
            >
              <option value="member">Member</option>
              <option value="advisor">Advisor</option>
            </select>
          </div>
        </div>

        {/* IMAGE */}
        <div className="md:col-span-2 space-y-2">
          <label className="text-xs font-bold uppercase text-gray-500">
            Profile Photo
          </label>

          {previewImage ? (
            <div className="relative h-56 w-full md:w-64 rounded-xl overflow-hidden border border-gray-200 group mx-auto md:mx-0">
              <img
                src={previewImage}
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="bg-red-500 text-white p-3 rounded-full cursor-pointer"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center h-56 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-emerald-400 bg-gray-50">
              <Upload size={28} className="text-gray-400 mb-2" />
              <span className="text-gray-500">Upload profile image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* BIO */}
        <div className="md:col-span-2 space-y-2">
          <label className="text-xs font-bold uppercase text-gray-500">
            Biography
          </label>
          <textarea
            rows={3}
            value={formData.bio}
            onChange={(e) =>
              setFormData({ ...formData, bio: e.target.value })
            }
            className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-emerald-400 outline-none"
          />
        </div>

        {/* OTHER INPUTS (same rule applied) */}
        {[
          ["email", "Professional Email"],
          ["linkedin", "LinkedIn"],
          ["facebook", "Facebook"],
          ["twitter", "Twitter"],
          ["instagram", "Instagram"],
        ].map(([key, label]) => (
          <div key={key} className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500">
              {label}
            </label>
            <input
              value={(formData as any)[key]}
              onChange={(e) =>
                setFormData({ ...formData, [key]: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-emerald-400 outline-none"
            />
          </div>
        ))}

        {/* ARRAY FIELDS */}
        {/* {(["education", "experience", "achievements"] as const).map(
          (type) => (
            <div
              key={type}
              className="md:col-span-2 space-y-3 bg-gray-50 p-5 rounded-xl border border-gray-200"
            >
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase text-gray-500">
                  {type}
                </label>

                <button
                  type="button"
                  onClick={() => addArrayField(type)}
                  className="text-emerald-600 text-xs font-bold flex items-center gap-1 cursor-pointer"
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
                    className="flex-1 border border-gray-300 rounded-lg p-2 text-gray-800 focus:ring-2 focus:ring-emerald-300 outline-none"
                  />

                  <button
                    type="button"
                    onClick={() => removeArrayField(i, type)}
                    className="text-red-500 hover:bg-red-50 p-2 rounded-lg cursor-pointer"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )
        )} */}

        {/* SUBMIT */}
        <button
          disabled={isSubmitting}
          type="submit"
          className="md:col-span-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl flex justify-center items-center cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin mr-2" /> Saving...
            </>
          ) : initialData ? (
            "Update Member Info"
          ) : (
            "Add to Team Directory"
          )}
        </button>
      </form>
    </motion.div>
  );
};