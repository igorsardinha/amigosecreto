"use client";

import { useActionState, useEffect } from "react";
import { updateParticipantEmail } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import { FormMessage } from "@/components/ui";

interface EditEmailModalProps {
  participantId: string;
  participantName: string;
  currentEmail: string | null;
  hostToken?: string;
  onClose: () => void;
}

export function EditEmailModal({
  participantId,
  participantName,
  currentEmail,
  hostToken,
  onClose,
}: EditEmailModalProps) {
  const [state, action] = useActionState(updateParticipantEmail, undefined);

  useEffect(() => {
    if (state?.success) {
      const timer = setTimeout(() => {
        onClose();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [state?.success, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
      <div className="card w-full max-w-sm space-y-4 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-stone-900">Vincular E-mail</h3>
            <p className="text-xs text-stone-500">
              Participante: <strong>{participantName}</strong>
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

        <form action={action} className="space-y-4">
          <input type="hidden" name="participantId" value={participantId} />
          {hostToken && <input type="hidden" name="hostToken" value={hostToken} />}

          <div>
            <label className="label" htmlFor="participantEmail">
              Endereço de e-mail
            </label>
            <input
              id="participantEmail"
              name="email"
              type="email"
              defaultValue={currentEmail ?? ""}
              className="input text-sm"
              placeholder="exemplo@email.com"
              autoFocus
            />
            <p className="mt-1 text-[11px] text-stone-500">
              O participante poderá usar este e-mail para recuperar o link dele ou receber avisos. Deixe em branco se quiser remover.
            </p>
          </div>

          <FormMessage state={state} />

          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={onClose} className="btn-secondary text-xs">
              Cancelar
            </button>
            <SubmitButton pendingText="Salvando..." className="text-xs py-2 px-3">
              Salvar E-mail
            </SubmitButton>
          </div>
        </form>
      </div>
    </div>
  );
}
