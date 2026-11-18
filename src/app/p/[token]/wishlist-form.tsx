"use client";

import { useActionState } from "react";
import { updateWishlist } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import { FormMessage } from "@/components/ui";

export function WishlistForm({ token, initial }: { token: string; initial: string }) {
  const [state, action] = useActionState(updateWishlist, undefined);

  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="token" value={token} />
      <textarea name="wishlist" rows={3} maxLength={1000} defaultValue={initial}
        aria-label="Lista de desejos" className="input"
        placeholder="Ideias de presente, tamanho de roupa…" />
      <FormMessage state={state} />
      <SubmitButton pendingText="Salvando…">Salvar lista</SubmitButton>
    </form>
  );
}
