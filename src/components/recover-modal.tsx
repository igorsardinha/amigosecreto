"use client";

import { useActionState, useState } from "react";
import { recoverLinks } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import { CopyButton } from "@/components/copy-button";

export function RecoverModal({ onClose }: { onClose: () => void }) {
  const [state, action] = useActionState(recoverLinks, undefined);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
      <div className="card w-full max-w-lg space-y-4 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-stone-900">🔍 Esqueci meu link</h2>
            <p className="mt-0.5 text-xs text-stone-500">
              Digite seu nome e/ou e-mail cadastrado para reencontrar seu amigo secreto.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
          >
            ✕
          </button>
        </div>

        <form action={action} className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="recoverName">
                Seu nome
              </label>
              <input
                id="recoverName"
                name="name"
                className="input text-sm"
                placeholder="Ex: Ana, Carlos..."
              />
            </div>
            <div>
              <label className="label" htmlFor="recoverEmail">
                Seu e-mail
              </label>
              <input
                id="recoverEmail"
                name="email"
                type="email"
                className="input text-sm"
                placeholder="exemplo@email.com"
              />
            </div>
          </div>

          <p className="text-[11px] text-stone-500">
            Você pode preencher apenas um dos campos ou ambos para uma busca mais precisa.
          </p>

          {state?.error && (
            <p role="alert" className="rounded-lg bg-red-50 p-2.5 text-xs text-red-700">
              {state.error}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={onClose} className="btn-secondary text-xs">
              Fechar
            </button>
            <SubmitButton pendingText="Buscando..." className="text-xs py-2 px-4">
              Localizar meus links
            </SubmitButton>
          </div>
        </form>

        {state?.links && state.links.length > 0 && (
          <div className="space-y-2 border-t border-stone-100 pt-3">
            <p className="text-xs font-semibold text-stone-800">
              Encontramos {state.links.length} resultado(s):
            </p>
            <div className="max-h-60 space-y-2 overflow-y-auto">
              {state.links.map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-stone-200 bg-stone-50/70 p-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-stone-900">{item.groupName}</span>
                      <span className="chip text-[10px] py-0.5">{item.status}</span>
                    </div>
                    <p className="text-[11px] text-stone-600">
                      Participante: <strong>{item.personName}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <CopyButton
                      text={item.url}
                      label="Copiar Link"
                      className="btn-secondary px-2 py-1 text-xs"
                    />
                    <a href={item.url} className="btn-primary px-3 py-1 text-xs">
                      Acessar ➔
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
