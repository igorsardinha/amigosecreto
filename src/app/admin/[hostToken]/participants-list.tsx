"use client";

import { useState } from "react";
import { CopyButton } from "@/components/copy-button";
import { SubmitButton } from "@/components/submit-button";
import { EditEmailModal } from "@/components/edit-email-modal";
import { removeParticipant } from "@/app/actions";

interface ParticipantItem {
  id: string;
  name: string;
  email: string | null;
  token: string;
  isHost: boolean;
  viewedAt: Date | null;
}

interface AdminParticipantsListProps {
  participants: ParticipantItem[];
  hostToken: string;
  baseUrl: string;
  isOpen: boolean;
}

export function AdminParticipantsList({
  participants,
  hostToken,
  baseUrl,
  isOpen,
}: AdminParticipantsListProps) {
  const [editingEmail, setEditingEmail] = useState<ParticipantItem | null>(null);

  if (participants.length === 0) {
    return <p className="text-sm text-stone-500">Ninguém se inscreveu ainda.</p>;
  }

  return (
    <>
      <ul className="divide-y divide-stone-100">
        {participants.map((p) => (
          <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-stone-900">
                {p.name} {p.isHost && <span className="text-xs text-stone-500">(você)</span>}
              </p>
              <div className="flex flex-wrap items-center gap-1.5 text-xs text-stone-500">
                <span className={p.email ? "text-stone-700" : "italic text-stone-400"}>
                  {p.email ?? "sem e-mail"}
                </span>
                <button
                  type="button"
                  onClick={() => setEditingEmail(p)}
                  className="font-medium text-red-700 hover:underline"
                  title="Vincular ou alterar e-mail"
                >
                  {p.email ? "[editar e-mail]" : "[+ vincular e-mail]"}
                </button>
                {!isOpen && (p.viewedAt ? " · ✅ já viu" : " · ainda não viu")}
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
              <CopyButton
                text={`${baseUrl}/p/${p.token}`}
                label="Link pessoal"
                className="btn-secondary px-2 py-1 text-xs"
              />
              {isOpen && (
                <form action={removeParticipant}>
                  <input type="hidden" name="hostToken" value={hostToken} />
                  <input type="hidden" name="participantId" value={p.id} />
                  <SubmitButton
                    variant="btn-danger"
                    pendingText="…"
                    ariaLabel={`Remover ${p.name}`}
                    confirmMessage={`Remover ${p.name} do amigo secreto?`}
                    className="text-xs px-2 py-1"
                  >
                    Remover
                  </SubmitButton>
                </form>
              )}
            </div>
          </li>
        ))}
      </ul>

      {editingEmail && (
        <EditEmailModal
          participantId={editingEmail.id}
          participantName={editingEmail.name}
          currentEmail={editingEmail.email}
          hostToken={hostToken}
          onClose={() => setEditingEmail(null)}
        />
      )}
    </>
  );
}
