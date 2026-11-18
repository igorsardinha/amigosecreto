import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { GroupInfo } from "@/components/ui";
import { JoinForm } from "./join-form";

export async function generateMetadata({ params }: PageProps<"/g/[code]">): Promise<Metadata> {
  const { code } = await params;
  const group = await db.group.findUnique({ where: { inviteCode: code }, select: { name: true } });
  return {
    title: group ? `Participe: ${group.name} — Amigo Secreto` : "Amigo Secreto",
    description: "Você foi convidado(a) para um amigo secreto! Inscreva-se pelo link.",
  };
}

export default async function JoinPage({ params }: PageProps<"/g/[code]">) {
  const { code } = await params;
  const group = await db.group.findUnique({
    where: { inviteCode: code },
    include: {
      participants: { select: { id: true, name: true }, orderBy: { createdAt: "asc" } },
    },
  });
  if (!group) notFound();

  return (
    <div className="space-y-6">
      <section className="card space-y-3">
        <p className="text-sm text-stone-500">
          <strong>{group.hostName}</strong> convidou você para o amigo secreto
        </p>
        <h1 className="text-2xl font-bold">{group.name}</h1>
        <GroupInfo
          description={group.description}
          budget={group.budget}
          eventDate={formatDate(group.eventDate)}
        />
      </section>

      {group.status === "OPEN" ? (
        <section className="card">
          <h2 className="mb-4 text-xl font-bold">Quero participar</h2>
          <JoinForm code={code} />
        </section>
      ) : (
        <section className="card text-center">
          <p className="text-4xl">🎉</p>
          <h2 className="mt-2 text-xl font-bold">O sorteio já foi realizado</h2>
          <p className="mt-1 text-stone-600">
            As inscrições estão encerradas. Se você participou, abra o seu link pessoal
            para ver quem tirou.
          </p>
        </section>
      )}

      <section className="card">
        <h2 className="mb-3 font-semibold">
          Participantes inscritos ({group.participants.length})
        </h2>
        {group.participants.length === 0 ? (
          <p className="text-sm text-stone-500">Ninguém ainda. Seja o primeiro!</p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {group.participants.map((p) => (
              <li key={p.id} className="chip">{p.name}</li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
