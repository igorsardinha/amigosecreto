"use client";

import { useActionState, useState } from "react";
import { createGroup } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import { FormMessage } from "@/components/ui";

export function CreateGroupForm() {
  const [state, action] = useActionState(createGroup, undefined);
  const [participates, setParticipates] = useState(true);

  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="label" htmlFor="name">Nome do amigo secreto *</label>
        <input id="name" name="name" required maxLength={80} className="input"
          placeholder="Ex.: Natal da Família Silva" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="eventDate">Data da revelação</label>
          <input id="eventDate" name="eventDate" type="date" className="input" />
        </div>
        <div>
          <label className="label" htmlFor="budget">Valor sugerido</label>
          <input id="budget" name="budget" maxLength={40} className="input"
            placeholder="Ex.: R$ 50 a R$ 100" />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="description">Recado para o grupo</label>
        <textarea id="description" name="description" rows={2} maxLength={500}
          className="input" placeholder="Local, horário, regras…" />
      </div>

      <hr className="border-stone-200" />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="hostName">Seu nome *</label>
          <input id="hostName" name="hostName" required maxLength={60} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="hostEmail">Seu e-mail (opcional)</label>
          <input id="hostEmail" name="hostEmail" type="email" maxLength={120} className="input" />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="hostParticipates" checked={participates}
          onChange={(e) => setParticipates(e.target.checked)}
          className="size-4 accent-red-700" />
        Eu também vou participar do sorteio
      </label>

      {participates && (
        <div>
          <label className="label" htmlFor="hostWishlist">Sua lista de desejos</label>
          <textarea id="hostWishlist" name="hostWishlist" rows={2} maxLength={1000}
            className="input" placeholder="Ideias de presente, tamanho de roupa…" />
        </div>
      )}

      <FormMessage state={state} />
      <SubmitButton pendingText="Criando…" className="w-full">
        Criar amigo secreto
      </SubmitButton>
    </form>
  );
}
