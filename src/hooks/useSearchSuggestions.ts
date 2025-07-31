"use client";

import { useState, useRef, useEffect } from "react";
import type { SearchFilters } from "@/lib/types";

export function useSearchSuggestions(
  onFilterChange: (f: SearchFilters) => void
) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const fetchSuggestions = async (q: string) => {
    if (!q) {
      setSuggestions([]);
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`/api/products?search=${encodeURIComponent(q)}`);
      const json = await res.json();
      const names = Array.isArray(json.data)
        ? json.data.map((p: any) => p.name).slice(0, 5)
        : [];
      setSuggestions(names);
    } catch {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const onQueryChange = (q: string) => {
    setQuery(q);
    setLoading(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(q), 300);
  };

  const selectSuggestion = (name: string) => {
    setQuery(name);
    onFilterChange({ search: name });
    setSuggestions([]);
  };

  // close suggestions on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".suggestion-panel")) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return { query, suggestions, loading, onQueryChange, selectSuggestion };
}
