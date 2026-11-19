"use client";

import { useActionState, useState } from "react";
import { moveParticipantSuperadmin } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import { FormMessage } from "@/components/ui";

interface TargetGroupOption {
  id: string;
  name: string;
  status: string;
}

interface MoveParticipantModalProps {
  participantId: string;
  participantName: string;
  currentGroupId: string;
  availableGroups: TargetGroupOption[];
  onClose: () => void;
}

export function MoveParticipantModal({
  participantId,
  participantName,
  currentGroupId,
  availableGroups,
  onClose,
}: MoveParticipantModalProps) {
  const [state, action] = useActionState(moveParticipantSuperadmin, undefined);

  // Filtra apenas grupos diferentes do atual e que estejam abertos
  const validGroups = availableGroups.filter(
    (g) => g.id !== currentGroupId && g.status === "OPEN"
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
      <div className="card w-full max-w-md space-y-4 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-stone-900">Mover Participante</h3>
            <p className="text-xs text-stone-500">
              Transferir <strong>{participantName}</strong> para outro amigo secreto.
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

        {validGroups.length === 0 ? (
          <div className="rounded-lg bg-amber-50 p-3 text-xs text-amber-900">
            Não há outros grupos com <strong>inscrições abertas</strong> disponíveis para mover este
            participante. Crie um novo grupo ou certifique-se de que os outros grupos não foram sorteados.
          </div>
        ) : (
          <form action={action} className="space-y-4">
            <input type="hidden" name="participantId" value={participantId} />

            <div>
              <label className="label" htmlFor="targetGroupId">
                Escolha o grupo de destino:
              </label>
              <select
                id="targetGroupId"
                name="targetGroupId"
                required
                className="input cursor-pointer"
                defaultValue=""
              >
                <option value="" disabled>
                  Selecione um amigo secreto...
                </option>
                {validGroups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            <p className="text-[11px] text-stone-500">
              💡 O link pessoal de <strong>{participantName}</strong> continuará o mesmo, mas agora ele
              fará parte do sorteio do novo grupo selecionado.
            </p>

            <FormMessage state={state} />

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={onClose} className="btn-secondary text-xs">
                Cancelar
              </button>
              <SubmitButton pendingText="Movendo..." className="text-xs py-2 px-3">
                Confirmar Transferência
              </SubmitButton>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
