import { useState, useCallback } from "react";

const STORAGE_KEY = "search_history";
const MAX_ITEMS = 8;

function readStorage(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function writeStorage(history: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {}
}

export function useSearchHistory() {
  const [history, setHistory] = useState<string[]>(() => readStorage());

  const add = useCallback((query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setHistory((prev) => {
      const updated = [trimmed, ...prev.filter((item) => item !== trimmed)].slice(0, MAX_ITEMS);
      writeStorage(updated);
      return updated;
    });
  }, []);

  const remove = useCallback((query: string) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item !== query);
      writeStorage(updated);
      return updated;
    });
  }, []);

  const clear = useCallback(() => {
    writeStorage([]);
    setHistory([]);
  }, []);

  return { history, add, remove, clear };
}
