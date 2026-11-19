"use client";

import { useState } from "react";
import { CopyButton } from "@/components/copy-button";

interface ParticipantItem {
  id: string;
  name: string;
  email: string | null;
  token: string;
  isHost: boolean;
  viewedAt: Date | null;
  assignedToName?: string | null;
}

interface GroupCardProps {
  baseUrl: string;
  group: {
    id: string;
    name: string;
    status: string;
    hostName: string;
    hostEmail: string | null;
    hostToken: string;
    inviteCode: string;
    createdAt: Date;
    drawnAt: Date | null;
    participants: ParticipantItem[];
  };
}

export function GroupCard({ group, baseUrl }: GroupCardProps) {
  const [showAllLinks, setShowAllLinks] = useState(false);
  const inviteUrl = `${baseUrl}/g/${group.inviteCode}`;
  const hostAdminUrl = `${baseUrl}/admin/${group.hostToken}`;
  const isOpen = group.status === "OPEN";

  // Gera texto formatado com todos os links pessoais para envio em massa
  const bulkLinksText = group.participants
    .map((p) => `${p.name}: ${baseUrl}/p/${p.token}`)
    .join("\n");

  return (
    <div className="card space-y-4">
      {/* Cabeçalho do Grupo */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-stone-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-stone-900">{group.name}</h2>
            <span
              className={`chip text-xs ${
                isOpen ? "bg-amber-100 text-amber-900" : "bg-green-100 text-green-900"
              }`}
            >
              {isOpen ? "Aberto" : "Sorteado"}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-stone-500">
            Criado por <strong>{group.hostName}</strong> ({group.hostEmail || "sem e-mail"}) em{" "}
            {new Date(group.createdAt).toLocaleDateString("pt-BR")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <CopyButton
            text={hostAdminUrl}
            label="Link do Anfitrião"
            className="btn-secondary px-2.5 py-1 text-xs"
          />
          <a
            href={hostAdminUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary px-2.5 py-1 text-xs"
          >
            Abrir Painel ↗
          </a>
        </div>
      </div>

      {/* Links Principais */}
      <div className="grid gap-2 text-xs sm:grid-cols-2">
        <div className="rounded-lg bg-stone-50 p-2.5">
          <span className="font-semibold text-stone-700">Link de Convite (Inscrição):</span>
          <div className="mt-1 flex items-center justify-between gap-1">
            <span className="truncate font-mono text-stone-600">{inviteUrl}</span>
            <CopyButton text={inviteUrl} label="Copiar" className="btn-secondary px-2 py-0.5 text-xs" />
          </div>
        </div>

        <div className="rounded-lg bg-stone-50 p-2.5">
          <span className="font-semibold text-stone-700">Ações em Massa:</span>
          <div className="mt-1 flex items-center gap-2">
            {group.participants.length > 0 ? (
              <CopyButton
                text={bulkLinksText}
                label="Copiar Todos Links Pessoais"
                className="btn-secondary px-2 py-0.5 text-xs"
              />
            ) : (
              <span className="text-stone-400">Sem participantes</span>
            )}
          </div>
        </div>
      </div>

      {/* Lista de Participantes */}
      <div>
        <div className="flex items-center justify-between pb-2">
          <h3 className="text-sm font-semibold text-stone-800">
            Participantes ({group.participants.length})
          </h3>
          {group.participants.length > 0 && (
            <button
              type="button"
              onClick={() => setShowAllLinks(!showAllLinks)}
              className="text-xs text-red-700 hover:underline"
            >
              {showAllLinks ? "Ocultar detalhes" : "Mostrar todos os links"}
            </button>
          )}
        </div>

        {group.participants.length === 0 ? (
          <p className="text-xs italic text-stone-400">Nenhum participante inscrito ainda.</p>
        ) : (
          <div className="divide-y divide-stone-100 rounded-lg border border-stone-200 bg-white">
            {group.participants.map((p) => {
              const personalUrl = `${baseUrl}/p/${p.token}`;
              return (
                <div key={p.id} className="p-2.5 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="font-medium text-stone-800">
                        {p.name} {p.isHost && <span className="text-stone-400">(anfitrião)</span>}
                      </span>
                      {p.email && <span className="ml-2 text-stone-400">({p.email})</span>}
                      {group.status === "DRAWN" && p.assignedToName && (
                        <span className="ml-2 text-stone-500">
                          ➜ tirou <strong className="text-red-700">{p.assignedToName}</strong>
                        </span>
                      )}
                      {p.viewedAt && (
                        <span className="ml-2 text-green-700 font-medium">✓ já visualizou</span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <CopyButton
                        text={personalUrl}
                        label="Copiar Link"
                        className="btn-secondary px-2 py-0.5 text-xs"
                      />
                      <a
                        href={personalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary px-2 py-0.5 text-xs text-stone-600"
                      >
                        Abrir ↗
                      </a>
                    </div>
                  </div>

                  {showAllLinks && (
                    <div className="mt-1 truncate font-mono text-[11px] text-stone-400">
                      {personalUrl}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
