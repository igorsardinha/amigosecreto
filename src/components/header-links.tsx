"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSavedLinks, removeSavedLink, type SavedLinkItem } from "@/lib/storage";
import { RecoverModal } from "./recover-modal";

export function HeaderLinks() {
  const [saved, setSaved] = useState<SavedLinkItem[]>([]);
  const [showRecover, setShowRecover] = useState(false);
  const [showSavedList, setShowSavedList] = useState(false);

  useEffect(() => {
    setSaved(getSavedLinks());
  }, []);

  const handleRemove = (url: string) => {
    removeSavedLink(url);
    setSaved(getSavedLinks());
  };

  return (
    <div className="flex items-center gap-2">
      {/* Botão de Links Salvos no Navegador */}
      {saved.length > 0 && (
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowSavedList(!showSavedList)}
            className="chip cursor-pointer bg-red-100 text-red-900 hover:bg-red-200"
          >
            ⭐ Meus Sorteios ({saved.length})
          </button>

          {showSavedList && (
            <div className="absolute right-0 top-8 z-40 w-72 rounded-xl border border-stone-200 bg-white p-3 shadow-lg">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <span className="text-xs font-bold text-stone-800">Salvos neste navegador</span>
                <button
                  type="button"
                  onClick={() => setShowSavedList(false)}
                  className="text-stone-400 hover:text-stone-600 text-xs"
                >
                  ✕
                </button>
              </div>

              <div className="mt-2 max-h-56 space-y-1.5 overflow-y-auto">
                {saved.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-1 rounded p-1.5 text-xs hover:bg-stone-50"
                  >
                    <a
                      href={item.url}
                      className="min-w-0 flex-1 truncate text-stone-800 hover:text-red-700"
                    >
                      <p className="truncate font-semibold">{item.groupName}</p>
                      <p className="truncate text-[10px] text-stone-500">
                        {item.type === "host" ? "Painel Anfitrião" : item.name}
                      </p>
                    </a>
                    <button
                      type="button"
                      onClick={() => handleRemove(item.url)}
                      className="px-1 text-stone-400 hover:text-red-600 text-xs"
                      title="Remover deste navegador"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Botão Esqueci meu link */}
      <button
        type="button"
        onClick={() => setShowRecover(true)}
        className="btn-secondary text-xs px-3 py-1.5 font-semibold text-stone-700 shadow-xs hover:border-red-400 hover:text-red-700"
      >
        🔍 Esqueci meu link
      </button>

      {showRecover && <RecoverModal onClose={() => setShowRecover(false)} />}
    </div>
  );
}
