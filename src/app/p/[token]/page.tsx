import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { formatDate, getBaseUrl } from "@/lib/utils";
import { GroupInfo } from "@/components/ui";
import { ShareLink } from "@/components/copy-button";
import { Reveal } from "./reveal";
import { WishlistForm } from "./wishlist-form";
import { SaveLinkTracker } from "@/components/save-link-tracker";

export const metadata: Metadata = {
  title: "Meu amigo secreto",
  robots: { index: false, follow: false },
};

export default async function ParticipantPage({
  params,
  searchParams,
}: PageProps<"/p/[token]">) {
  const { token } = await params;
  const { novo } = await searchParams;

  const me = await db.participant.findUnique({
    where: { token },
    include: {
      group: true,
      assignedTo: { select: { name: true, wishlist: true } },
    },
  });
  if (!me) notFound();

  const { group } = me;
  const drawn = group.status === "DRAWN" && me.assignedTo;

  if (drawn && !me.viewedAt) {
    await db.participant.update({ where: { id: me.id }, data: { viewedAt: new Date() } });
  }

  const myUrl = `${await getBaseUrl()}/p/${token}`;

  return (
    <div className="space-y-6">
      <SaveLinkTracker
        type="participant"
        name={me.name}
        groupName={group.name}
        url={myUrl}
      />
      {novo && (
        <section className="card border-amber-300 bg-amber-50">
          <h2 className="font-bold text-amber-900">✅ Inscrição confirmada!</h2>
          <p className="mt-1 text-sm text-amber-900">
            <strong>Guarde este link</strong> — é por ele que você vai descobrir quem tirou.
            Ele é só seu, não compartilhe.
            {me.email && " Também avisaremos você por e-mail quando o sorteio acontecer."}
          </p>
          <div className="mt-3">
            <ShareLink url={myUrl} />
          </div>
        </section>
      )}

      <section className="card space-y-3">
        <p className="text-sm text-stone-500">Olá, <strong>{me.name}</strong>! 👋</p>
        <h1 className="text-2xl font-bold">{group.name}</h1>
        <GroupInfo
          description={group.description}
          budget={group.budget}
          eventDate={formatDate(group.eventDate)}
        />
      </section>

      {drawn ? (
        <Reveal name={me.assignedTo!.name} wishlist={me.assignedTo!.wishlist} />
      ) : (
        <section className="card text-center">
          <p className="text-4xl">⏳</p>
          <h2 className="mt-2 text-xl font-bold">Aguardando o sorteio</h2>
          <p className="mt-1 text-stone-600">
            Quando {group.hostName} realizar o sorteio, o nome do seu amigo secreto
            aparecerá aqui. Volte a este link depois!
          </p>
        </section>
      )}

      <section className="card">
        <h2 className="mb-1 text-lg font-bold">Minha lista de desejos</h2>
        <p className="mb-3 text-sm text-stone-500">
          Quem tirou você verá esta lista. Você pode editá-la a qualquer momento.
        </p>
        <WishlistForm token={token} initial={me.wishlist ?? ""} />
      </section>

      {!novo && (
        <details className="card text-sm">
          <summary className="cursor-pointer font-medium">Meu link pessoal</summary>
          <div className="mt-3"><ShareLink url={myUrl} /></div>
        </details>
      )}
    </div>
  );
}
