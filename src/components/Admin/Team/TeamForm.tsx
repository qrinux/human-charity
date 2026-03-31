"use client";

import React, { useState } from "react";
import { X, Loader2, Plus, Trash2, Upload, Users, Link as LinkIcon, ChevronDown } from "lucide-react";
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

export const TeamForm = ({ initialData, onSubmit, onClose, isSubmitting }: TeamFormProps) => {
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
    education: initialData?.education?.length > 0 ? [...initialData.education] : [""],
    experience: initialData?.experience?.length > 0 ? [...initialData.experience] : [""],
    achievements: initialData?.achievements?.length > 0 ? [...initialData.achievements] : [""],
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
    setFormData({ ...formData, image: "" });
  };

  const handleArrayChange = (index: number, value: string, type: 'education' | 'experience' | 'achievements') => {
    const newArr = [...formData[type]];
    newArr[index] = value;
    setFormData({ ...formData, [type]: newArr });
  };

  const addArrayField = (type: 'education' | 'experience' | 'achievements') => {
    setFormData({ ...formData, [type]: [...formData[type], ""] });
  };

  const removeArrayField = (index: number, type: 'education' | 'experience' | 'achievements') => {
    if (formData[type].length <= 1) return;
    setFormData({ 
      ...formData, 
      [type]: formData[type].filter((_: string, i: number) => i !== index) 
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
    
    data.append("education", JSON.stringify(formData.education.filter(s => s.trim() !== "")));
    data.append("experience", JSON.stringify(formData.experience.filter(s => s.trim() !== "")));
    data.append("achievements", JSON.stringify(formData.achievements.filter(s => s.trim() !== "")));

    if (newFile) {
      data.append("image", newFile);
    } else {
      data.append("existingImage", formData.image);
    }

    if (initialData?.id) {
        data.append("id", initialData.id);
    }

    onSubmit(data);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#1e293b] p-6 md:p-8 rounded-2xl border border-slate-800 shadow-2xl max-w-4xl mx-auto"
    >
      <div className="flex justify-between items-center mb-8 border-b border-slate-700/50 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500"><Users size={24} /></div>
          <h2 className="text-xl font-bold text-white">{initialData ? "Update Member" : "New Team Member"}</h2>
        </div>
        <button onClick={onClose} className="text-white p-2 hover:bg-red-500/20 bg-red-500 rounded-full transition-all cursor-pointer"><X size={24} /></button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-slate-500">Full Name</label>
          <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[#0f172a] border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all" />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-slate-500"> Designation</label>
          <input required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-[#0f172a] border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all" />
        </div>
        <div className="space-y-2">
  <label className="text-xs font-bold uppercase text-slate-500">
    Member Type
  </label>

  <div className="relative">
    <select
      value={formData.memberType}
      onChange={(e) =>
        setFormData({ ...formData, memberType: e.target.value })
      }
      className="w-full appearance-none bg-[#0f172a] border border-slate-700 rounded-lg p-3 pr-10 text-white outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer"
    >
      <option value="member">Member</option>
      <option value="advisor">Advisor</option>
    </select>

    {/* dropdown icon */}
    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
      <ChevronDown></ChevronDown>
    </div>
  </div>
</div>
        {/* Profile Image */}
        <div className="md:col-span-2 space-y-2">
          <label className="text-xs font-bold uppercase text-slate-500">Profile Photo</label>
          {previewImage ? (
            <div className="relative h-56 w-full md:w-64 rounded-xl overflow-hidden border border-slate-700 group mx-auto md:mx-0">
              <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button type="button" onClick={handleRemoveImage} className="bg-rose-500 text-white p-3 rounded-full hover:scale-110 transition-transform cursor-pointer"><Trash2 size={20} /></button>
              </div>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center h-56 border-2 border-dashed border-slate-700 rounded-xl cursor-pointer hover:border-emerald-500/50 bg-[#0f172a] transition-all group">
              <Upload size={28} className="text-slate-500 mb-2 group-hover:text-emerald-500" />
              <span className="text-slate-400 font-medium">Upload profile image</span>
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          )}
        </div>

        {/* Bio */}
        <div className="md:col-span-2 space-y-2">
          <label className="text-xs font-bold uppercase text-slate-500">Short Biography</label>
          <textarea rows={3} value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full bg-[#0f172a] border border-slate-700 rounded-lg p-3 text-white outline-none focus:ring-2 focus:ring-emerald-500/50" />
        </div>

        {/* Expertise & Email */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-slate-500">Expertise (e.g. Agronomy)</label>
          <input value={formData.expertise} onChange={e => setFormData({...formData, expertise: e.target.value})} className="w-full bg-[#0f172a] border border-slate-700 rounded-lg p-3 text-white outline-none focus:ring-2 focus:ring-emerald-500/50" />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-slate-500">Professional Email</label>
          <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-[#0f172a] border border-slate-700 rounded-lg p-3 text-white outline-none focus:ring-2 focus:ring-emerald-500/50" />
        </div>

        {/* LinkedIn */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-slate-500 flex items-center gap-2">
            <LinkIcon size={14} /> LinkedIn Profile URL
          </label>
          <input value={formData.linkedin} onChange={e => setFormData({...formData, linkedin: e.target.value})} className="w-full bg-[#0f172a] border border-slate-700 rounded-lg p-3 text-white outline-none focus:ring-2 focus:ring-emerald-500/50" placeholder="https://linkedin.com/in/..." />
        </div>

        {/* Facebook */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-slate-500">Facebook Profile URL</label>
          <input value={formData.facebook} onChange={e => setFormData({...formData, facebook: e.target.value})} className="w-full bg-[#0f172a] border border-slate-700 rounded-lg p-3 text-white outline-none focus:ring-2 focus:ring-emerald-500/50" placeholder="https://facebook.com/..." />
        </div>

        {/* Twitter */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-slate-500">Twitter Profile URL</label>
          <input value={formData.twitter} onChange={e => setFormData({...formData, twitter: e.target.value})} className="w-full bg-[#0f172a] border border-slate-700 rounded-lg p-3 text-white outline-none focus:ring-2 focus:ring-emerald-500/50" placeholder="https://twitter.com/..." />
        </div>

        {/* Instagram */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-slate-500">Instagram Profile URL</label>
          <input value={formData.instagram} onChange={e => setFormData({...formData, instagram: e.target.value})} className="w-full bg-[#0f172a] border border-slate-700 rounded-lg p-3 text-white outline-none focus:ring-2 focus:ring-emerald-500/50" placeholder="https://instagram.com/..." />
        </div>

        {/* Dynamic Lists (Education, Experience, Achievements) */}
        {(['education', 'experience', 'achievements'] as const).map((type) => (
          <div key={type} className=" space-y-3 bg-[#0f172a]/50 p-5 rounded-xl border border-slate-800 md:col-span-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase text-slate-500">{type}</label>
              <button type="button" onClick={() => addArrayField(type)} className="text-emerald-400 text-xs font-bold flex items-center gap-1 hover:text-emerald-300 transition-colors cursor-pointer"><Plus size={14} /> Add {type}</button>
            </div>
            {formData[type].map((val, i) => (
              <div key={i} className="flex gap-2">
                <input value={val} onChange={e => handleArrayChange(i, e.target.value, type)} className="flex-1 bg-[#0f172a] border border-slate-700 rounded-lg p-2 text-sm text-white focus:border-emerald-500 outline-none transition-all" />
                <button type="button" onClick={() => removeArrayField(i, type)} className="text-rose-500 hover:bg-rose-500/10 p-2 rounded-lg cursor-pointer transition-colors"><Trash2 size={18}/></button>
              </div>
            ))}
          </div>
        ))}

        <button disabled={isSubmitting} type="submit" className="md:col-span-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all mt-4 flex justify-center items-center shadow-lg shadow-emerald-900/20 cursor-pointer">
          {isSubmitting ? <><Loader2 className="animate-spin mr-2" /> Saving Member...</> : (initialData ? "Update Member Info" : "Add to Team Directory")}
        </button>
      </form>
    </motion.div>
  );
};