"use client";

import { useActionState } from "react";
import { drawGroup } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import { FormMessage } from "@/components/ui";

const MIN = 3;

export function DrawForm({ hostToken, count }: { hostToken: string; count: number }) {
  const [state, action] = useActionState(drawGroup, undefined);
  const missing = Math.max(0, MIN - count);

  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="hostToken" value={hostToken} />
      <FormMessage state={state} />
      {missing > 0 ? (
        <p className="text-sm text-stone-500">
          Faltam pelo menos {missing} participante(s) para sortear.
        </p>
      ) : (
        <SubmitButton
          pendingText="Sorteando…"
          className="w-full py-3 text-lg"
          confirmMessage={`Sortear agora entre ${count} participantes? As inscrições serão encerradas.`}
        >
          🎲 Sortear agora
        </SubmitButton>
      )}
    </form>
  );
}
