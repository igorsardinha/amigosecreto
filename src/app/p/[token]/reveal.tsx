"use client";

import { useState } from "react";

export function Reveal({ name, wishlist }: { name: string; wishlist: string | null }) {
  const [open, setOpen] = useState(false);

  return (
    <section className="card overflow-hidden text-center">
      {!open ? (
        <div className="space-y-4 py-4">
          <p className="text-5xl">🎁</p>
          <h2 className="text-xl font-bold">O sorteio foi realizado!</h2>
          <p className="text-stone-600">Certifique-se de que ninguém está olhando…</p>
          <button type="button" className="btn-primary px-6 py-3 text-lg" onClick={() => setOpen(true)}>
            Revelar meu amigo secreto
          </button>
        </div>
      ) : (
        <div className="animate-[reveal_.5s_ease-out] space-y-4 py-4">
          <p className="text-sm uppercase tracking-widest text-stone-500">Você tirou</p>
          <p className="text-4xl font-extrabold text-red-700">{name}</p>
          <div className="mx-auto max-w-md rounded-xl bg-green-50 p-4 text-left">
            <p className="mb-1 text-sm font-semibold text-green-900">Lista de desejos</p>
            {wishlist ? (
              <p className="whitespace-pre-line text-sm text-green-900">{wishlist}</p>
            ) : (
              <p className="text-sm italic text-green-800">
                {name} ainda não preencheu a lista. Volte depois para conferir!
              </p>
            )}
          </div>
          <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>
            Esconder
          </button>
        </div>
      )}
      <style>{`@keyframes reveal{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:scale(1)}}`}</style>
    </section>
  );
}
