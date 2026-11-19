import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { formatDate, getBaseUrl } from "@/lib/utils";
import { emailEnabled } from "@/lib/email";
import { removeParticipant } from "@/app/actions";
import { GroupInfo } from "@/components/ui";
import { CopyButton, ShareLink } from "@/components/copy-button";
import { DrawForm } from "./draw-form";
import { SubmitButton } from "@/components/submit-button";
import { SaveLinkTracker } from "@/components/save-link-tracker";

export const metadata: Metadata = {
  title: "Painel do anfitrião — Amigo Secreto",
  robots: { index: false, follow: false },
};

export default async function AdminPage({
  params,
  searchParams,
}: PageProps<"/admin/[hostToken]">) {
  const { hostToken } = await params;
  const { novo } = await searchParams;

  const group = await db.group.findUnique({
    where: { hostToken },
    include: { participants: { orderBy: { createdAt: "asc" } } },
  });
  if (!group) notFound();

  const base = await getBaseUrl();
  const inviteUrl = `${base}/g/${group.inviteCode}`;
  const adminUrl = `${base}/admin/${hostToken}`;
  const isOpen = group.status === "OPEN";
  const me = group.participants.find((p) => p.isHost);
  const viewed = group.participants.filter((p) => p.viewedAt).length;

  return (
    <div className="space-y-6">
      <SaveLinkTracker
        type="host"
        name={group.hostName}
        groupName={group.name}
        url={adminUrl}
      />
      {novo && (
        <section className="card border-amber-300 bg-amber-50">
          <h2 className="font-bold text-amber-900">🎉 Amigo secreto criado!</h2>
          <p className="mt-1 text-sm text-amber-900">
            <strong>Salve o link desta página</strong> — ele é o seu painel de anfitrião e
            não pode ser recuperado depois.
          </p>
          <div className="mt-3"><ShareLink url={adminUrl} /></div>
        </section>
      )}

      <section className="card space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-stone-500">Painel do anfitrião</p>
            <h1 className="text-2xl font-bold">{group.name}</h1>
          </div>
          <span className={`chip ${isOpen ? "bg-amber-100 text-amber-900" : "bg-green-100 text-green-900"}`}>
            {isOpen ? "Inscrições abertas" : "Sorteado"}
          </span>
        </div>
        <GroupInfo
          description={group.description}
          budget={group.budget}
          eventDate={formatDate(group.eventDate)}
        />
      </section>

      {!isOpen && (
        <section className="card border-green-300 bg-green-50">
          <h2 className="font-bold text-green-900">🎉 Sorteio realizado!</h2>
          <p className="mt-1 text-sm text-green-900">
            {group.drawnAt &&
              `Feito em ${group.drawnAt.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}. `}
            {group.participants.some((p) => p.email) && emailEnabled()
              ? "Quem informou e-mail foi avisado. Envie o link pessoal para os demais."
              : "Envie a cada participante o seu link pessoal (botão \"Link pessoal\" abaixo)."}
          </p>
        </section>
      )}

      {isOpen && (
        <section className="card space-y-3">
          <h2 className="text-lg font-bold">1. Convide os participantes</h2>
          <p className="text-sm text-stone-600">
            Envie este link para todo mundo. Cada pessoa se inscreve com nome e lista de desejos.
          </p>
          <ShareLink
            url={inviteUrl}
            whatsappText={`🎁 Participe do amigo secreto "${group.name}"! Inscreva-se aqui:`}
          />
        </section>
      )}

      <section className="card space-y-3">
        <h2 className="text-lg font-bold">
          {isOpen ? "2. " : ""}Participantes ({group.participants.length})
        </h2>
        {!isOpen && (
          <p className="text-sm text-stone-600">
            {viewed} de {group.participants.length} já viram quem tiraram.
          </p>
        )}
        {group.participants.length === 0 ? (
          <p className="text-sm text-stone-500">Ninguém se inscreveu ainda.</p>
        ) : (
          <ul className="divide-y divide-stone-100">
            {group.participants.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-2 py-2">
                <div className="min-w-0">
                  <p className="truncate font-medium">
                    {p.name} {p.isHost && <span className="text-xs text-stone-500">(você)</span>}
                  </p>
                  <p className="truncate text-xs text-stone-500">
                    {p.email ?? "sem e-mail"}
                    {!isOpen && (p.viewedAt ? " · ✅ já viu" : " · ainda não viu")}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <CopyButton
                    text={`${base}/p/${p.token}`}
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
                      >
                        Remover
                      </SubmitButton>
                    </form>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
        <p className="text-xs text-stone-500">
          Use &quot;Link pessoal&quot; para reenviar o link a quem perdeu. Para manter a surpresa,
          não abra o link de outra pessoa.
        </p>
      </section>

      {isOpen ? (
        <section className="card space-y-3">
          <h2 className="text-lg font-bold">3. Realize o sorteio</h2>
          <p className="text-sm text-stone-600">
            Quando todos estiverem inscritos, faça o sorteio. Depois disso as inscrições
            são encerradas.
            {emailEnabled()
              ? " Quem informou e-mail receberá um aviso automaticamente."
              : " Envie a cada pessoa o seu link pessoal (o e-mail não está configurado)."}
          </p>
          <DrawForm hostToken={hostToken} count={group.participants.length} />
        </section>
      ) : (
        me && (
          <section className="card space-y-3 text-center">
            <p className="text-4xl">🎁</p>
            <h2 className="text-lg font-bold">E você, quem tirou?</h2>
            <Link href={`/p/${me.token}`} className="btn-primary">Ver meu amigo secreto</Link>
          </section>
        )
      )}
    </div>
  );
}
