"use client";

export interface SavedLinkItem {
  type: "participant" | "host";
  name: string;
  groupName: string;
  url: string;
  savedAt: string;
}

const STORAGE_KEY = "amigo_secreto_links";

export function getSavedLinks(): SavedLinkItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveUserLink(item: SavedLinkItem): void {
  if (typeof window === "undefined") return;
  try {
    const current = getSavedLinks();
    // Evita duplicar se a mesma URL já estiver salva
    const filtered = current.filter((i) => i.url !== item.url);
    filtered.unshift(item); // adiciona no início
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered.slice(0, 10)));
  } catch {
    // ignora falha em modo incógnito restritivo
  }
}

export function removeSavedLink(url: string): void {
  if (typeof window === "undefined") return;
  try {
    const current = getSavedLinks();
    const filtered = current.filter((i) => i.url !== url);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch {}
}
