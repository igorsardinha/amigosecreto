"use client";

import { useActionState } from "react";
import { joinGroup } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import { FormMessage } from "@/components/ui";

export function JoinForm({ code }: { code: string }) {
  const [state, action] = useActionState(joinGroup, undefined);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="code" value={code} />
      <div>
        <label className="label" htmlFor="name">Seu nome *</label>
        <input id="name" name="name" required maxLength={60} className="input"
          placeholder="Como o grupo te conhece" />
      </div>
      <div>
        <label className="label" htmlFor="email">E-mail (opcional)</label>
        <input id="email" name="email" type="email" maxLength={120} className="input"
          placeholder="Para receber o aviso do sorteio" />
      </div>
      <div>
        <label className="label" htmlFor="wishlist">Lista de desejos</label>
        <textarea id="wishlist" name="wishlist" rows={3} maxLength={1000} className="input"
          placeholder="Ideias de presente, tamanho de roupa, o que você NÃO quer ganhar…" />
      </div>
      <FormMessage state={state} />
      <SubmitButton pendingText="Inscrevendo…" className="w-full">
        Entrar no amigo secreto
      </SubmitButton>
    </form>
  );
}
