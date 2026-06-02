// src/components/Hooks/useGallery.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { getGalleryItems } from "@/app/ServerActions/galleryItem";

export function useGallery() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const res = await getGalleryItems();
    if (res.success) setItems(res.data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return { items, loading, refresh: fetchItems };
}