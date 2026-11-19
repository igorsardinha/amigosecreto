"use client";

import { useState } from "react";
import { RecoverModal } from "./recover-modal";

export function RecoverBanner() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-xl border border-stone-200 bg-white/80 p-3.5 shadow-xs backdrop-blur-xs">
        <div className="flex items-center gap-2.5 text-center sm:text-left">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-sm">
            🔍
          </span>
          <div>
            <p className="text-xs font-bold text-stone-900">
              Já está participando de um amigo secreto?
            </p>
            <p className="text-[11px] text-stone-500">
              Perdeu ou esqueceu o seu link? Encontre-o digitando seu nome ou e-mail.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="btn-secondary w-full sm:w-auto text-xs px-3.5 py-2 font-semibold hover:border-red-400 hover:text-red-700"
        >
          🔍 Esqueci meu link
        </button>
      </div>

      {showModal && <RecoverModal onClose={() => setShowModal(false)} />}
    </>
  );
}
