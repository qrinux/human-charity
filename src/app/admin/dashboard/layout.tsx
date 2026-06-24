"use client";
import React, { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, FileText, Briefcase, BellRing,
  Globe, Users, Images, Contact, Menu, X, UserCog
} from "lucide-react";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { name: "Overview", icon: <LayoutDashboard size={20} />, href: "/admin/dashboard" },
    { name: "Hero Section", icon: <Globe size={20} />, href: "/admin/dashboard/hero" },
    { name: "Projects", icon: <Briefcase size={20} />, href: "/admin/dashboard/projects" },
    { name: "Our Team", icon: <Users size={20} />, href: "/admin/dashboard/team" },
    { name: "Gallery Album", icon: <Images size={20} />, href: "/admin/dashboard/gallery" },
    { name: "Contacts", icon: <Contact size={20} />, href: "/admin/dashboard/contacts" },
    { name: "Users", icon: <UserCog size={20} />, href: "/admin/dashboard/users" },
    { name: "View Public Site", icon: <FileText size={20} />, href: "/" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
    
      <aside className="hidden md:flex w-72 bg-white border-r border-slate-200 flex-col shadow-sm">
        <div className="p-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
            Human Care
          </h2>
          <p className="text-xs text-slate-400 font-medium tracking-widest uppercase mt-1">
            Admin Panel
          </p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                  ${isActive
                    ? "bg-emerald-50 text-emerald-600 shadow-sm"
                    : "text-slate-500 hover:bg-emerald-50 hover:text-emerald-600"}`}
              >
                <span className={isActive ? "text-emerald-600" : ""}>
                  {item.icon}
                </span>
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="w-64 bg-white border-r border-slate-200 flex flex-col p-6 space-y-2">
            <button
              className="self-end mb-4 text-slate-500"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X size={24} />
            </button>

            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                    ${isActive
                      ? "bg-emerald-50 text-emerald-600"
                      : "text-slate-500 hover:bg-emerald-50 hover:text-emerald-600"}`}
                >
                  {item.icon}
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>

          <div
            className="flex-1 bg-black/30"
            onClick={() => setIsSidebarOpen(false)}
          />
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col">
        
        {/* Header */}
        <header className="h-20 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between px-6 md:px-10">
          <div className="flex items-center gap-4 md:gap-8">
            <button
              className="md:hidden text-slate-600"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={28} />
            </button>
            <span className="text-sm text-slate-500 hidden md:inline">
              Welcome back, Admin
            </span>
          </div>

          <UserButton
            afterSignOutUrl="/"
            appearance={{ elements: { userButtonAvatarBox: "h-10 w-10" } }}
          />
        </header>

        {/* Content */}
        <main className="p-6 md:p-10 animate-in fade-in duration-500">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;