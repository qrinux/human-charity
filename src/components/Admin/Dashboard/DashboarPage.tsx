"use client";

import React from "react";
import {
  Briefcase,
  Users,
  Mail,
  Bell,
  ArrowUpRight,
  TrendingUp,
  Activity,
  Calendar,
} from "lucide-react";
import { useProjects } from "@/components/Hooks/useProjects";
import { useTeam } from "@/components/Hooks/useTeam";
import { useContacts } from "@/components/Hooks/useContact";
import { useNotices } from "@/components/Hooks/useNotices";
import { useRouter } from "next/navigation";

const DashboardPage = () => {
  const { projects, loading: pL } = useProjects();
  const { team, loading: tL } = useTeam();
  const { contacts, loading: cL } = useContacts();
  const { latestNotices, loading: nL } = useNotices();
  const router = useRouter()
  const loading = pL || tL || cL || nL;

  const stats = [
    { title: "Active Projects", value: projects?.length || 0, icon: Briefcase, color: "text-emerald-600", bg: "bg-emerald-100" },
    { title: "Team Members", value: team?.length || 0, icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "New Contacts", value: contacts?.length || 0, icon: Mail, color: "text-amber-600", bg: "bg-amber-100" },
    { title: "System Notices", value: latestNotices?.length || 0, icon: Bell, color: "text-rose-600", bg: "bg-rose-100" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <header>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-800">
            System Overview
          </h1>
          <p className="text-slate-500 font-medium flex items-center gap-2 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live monitoring — {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
          </p>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                    <Icon size={22} />
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
                    <TrendingUp size={12} /> +12%
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-sm text-slate-500 uppercase tracking-wider">{stat.title}</p>
                  <h2 className="text-3xl font-bold mt-1">
                    {loading ? <div className="h-8 w-14 bg-slate-200 animate-pulse rounded" /> : stat.value}
                  </h2>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Notices */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Bell className="text-rose-500" size={20} />
                  Latest Notices
              </h3>
              <button onClick={() => router.push("/admin/dashboard/notices")} className="text-sm cursor-pointer text-blue-600 hover:underline">View all</button>
            </div>

            <div className="grid gap-3">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <div key={i} className="h-20 bg-slate-100 rounded-xl animate-pulse" />
                ))
              ) : latestNotices.length > 0 ? (
                latestNotices.slice(0, 4).map((n: any) => (
                  <div key={n.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                        <Calendar size={18} />
                      </div>
                      <div>
                        <p className="font-medium">{n.title}</p>
                        <p className="text-xs text-slate-400">{new Date(n.createdAt).toDateString()}</p>
                      </div>
                    </div>
                    <ArrowUpRight className="text-slate-400" size={18} />
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-slate-400 italic">No recent updates found.</div>
              )}
            </div>
          </div>

          {/* Activity */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-6">
              <Activity className="text-emerald-500" size={20} />
              Live Activity
            </h3>

            <div className="space-y-6">
              {loading ? (
                <p className="text-slate-500 text-sm">Loading activity...</p>
              ) : (
                [
                  contacts?.[0] && {
                    text: `New contact from ${contacts[0]?.name}`,
                    time: contacts[0]?.createdAt,
                  },
                  projects?.[0] && {
                    text: `Project added: ${projects[0]?.title}`,
                    time: projects[0]?.createdAt,
                  },
                  team?.[0] && {
                    text: `New team member: ${team[0]?.name}`,
                    time: team[0]?.createdAt,
                  },
                  latestNotices?.[0] && {
                    text: `Notice published: ${latestNotices[0]?.title}`,
                    time: latestNotices[0]?.createdAt,
                  },
                ]
                  .filter(Boolean)
                  .map((item: any, i) => (
                    <div key={i}>
                      <p className="text-sm font-medium">{item.text}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {item.time ? new Date(item.time).toLocaleString() : "Just now"}
                      </p>
                    </div>
                  ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DashboardPage;