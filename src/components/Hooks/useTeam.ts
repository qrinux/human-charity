"use client";

import { useEffect, useState, useCallback } from "react";
import { getTeamMembers, getTeamMemberBySlug } from "@/app/ServerActions/team";

export function useTeam(slug?: string, trashed: boolean = false) {
  const [team, setTeam] = useState<any[]>([]);
  const [member, setMember] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (slug) {
        const res = await getTeamMemberBySlug(slug);
        if (res.success) {
          setMember(res.data ?? null);
        }
      } else {
        const res = await getTeamMembers(trashed);
        if (res.success) {
          setTeam(res.data ?? []);
        }
      }
    } catch (error) {
      console.error("Hook Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  }, [slug, trashed]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { 
    team, 
    setTeam, 
    member, 
    loading, 
    refresh: fetchData 
  };
}