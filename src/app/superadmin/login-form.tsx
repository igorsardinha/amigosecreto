"use client";

import { useActionState } from "react";
import { loginSuperadmin } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import { FormMessage } from "@/components/ui";

export function SuperadminLoginForm() {
  const [state, action] = useActionState(loginSuperadmin, undefined);

  return (
    <div className="mx-auto max-w-sm">
      <form action={action} className="card space-y-4">
        <div>
          <h1 className="text-xl font-bold text-stone-900">Acesso Restrito</h1>
          <p className="mt-1 text-sm text-stone-500">
            Digite a senha mestra para visualizar todos os grupos e links gerados.
          </p>
        </div>

        <div>
          <label className="label" htmlFor="secret">
            Senha do Superadmin
          </label>
          <input
            id="secret"
            name="secret"
            type="password"
            required
            autoFocus
            className="input"
            placeholder="Digite a senha..."
          />
        </div>

        <FormMessage state={state} />

        <SubmitButton pendingText="Entrando..." className="w-full">
          Acessar Painel
        </SubmitButton>
      </form>
    </div>
  );
}
