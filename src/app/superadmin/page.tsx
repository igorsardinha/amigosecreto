import type { Metadata } from "next";
import { db } from "@/lib/db";
import { getBaseUrl } from "@/lib/utils";
import { isAuthenticated } from "@/lib/admin-auth";
import { logoutSuperadmin } from "@/app/actions";
import { SuperadminLoginForm } from "./login-form";
import { GroupCard } from "./group-card";

export const metadata: Metadata = {
  title: "Superadmin — Todos os Amigos Secretos",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function SuperadminPage() {
  const auth = await isAuthenticated();

  if (!auth) {
    return (
      <div className="py-8">
        <SuperadminLoginForm />
      </div>
    );
  }

  const baseUrl = await getBaseUrl();

  const groups = await db.group.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      participants: {
        orderBy: { createdAt: "asc" },
        include: {
          assignedTo: {
            select: { name: true },
          },
        },
      },
    },
  });

  const totalParticipants = groups.reduce((acc, g) => acc + g.participants.length, 0);
  const totalDrawn = groups.filter((g) => g.status === "DRAWN").length;

  return (
    <div className="space-y-6">
      {/* Barra superior de estatísticas e Logout */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-stone-900">
            Painel Geral do Sistema
          </h1>
          <p className="text-xs text-stone-500">
            Visão completa de todos os sorteios, links de convite e links pessoais gerados.
          </p>
        </div>

        <form action={logoutSuperadmin}>
          <button type="submit" className="btn-secondary text-xs">
            Sair do Admin
          </button>
        </form>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="card p-3">
          <p className="text-2xl font-bold text-stone-900">{groups.length}</p>
          <p className="text-xs text-stone-500">Grupos Criados</p>
        </div>
        <div className="card p-3">
          <p className="text-2xl font-bold text-stone-900">{totalParticipants}</p>
          <p className="text-xs text-stone-500">Participantes Totais</p>
        </div>
        <div className="card p-3">
          <p className="text-2xl font-bold text-green-700">{totalDrawn}</p>
          <p className="text-xs text-stone-500">Sorteios Realizados</p>
        </div>
      </div>

      {/* Lista de Grupos */}
      <div className="space-y-4">
        {groups.length === 0 ? (
          <div className="card py-8 text-center text-stone-500">
            Nenhum grupo de amigo secreto foi criado até o momento.
          </div>
        ) : (
          groups.map((group) => {
            const mappedParticipants = group.participants.map((p) => ({
              id: p.id,
              name: p.name,
              email: p.email,
              token: p.token,
              isHost: p.isHost,
              viewedAt: p.viewedAt,
              assignedToName: p.assignedTo?.name || null,
            }));

            return (
              <GroupCard
                key={group.id}
                baseUrl={baseUrl}
                group={{
                  id: group.id,
                  name: group.name,
                  status: group.status,
                  hostName: group.hostName,
                  hostEmail: group.hostEmail,
                  hostToken: group.hostToken,
                  inviteCode: group.inviteCode,
                  createdAt: group.createdAt,
                  drawnAt: group.drawnAt,
                  participants: mappedParticipants,
                }}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
