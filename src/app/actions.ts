"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { inviteCode, secretToken } from "@/lib/tokens";
import { drawSecretFriends } from "@/lib/draw";
import { sendDrawEmail } from "@/lib/email";
import { field, getBaseUrl, isEmail, parseDateInput } from "@/lib/utils";
import { setAdminSession, clearAdminSession, isAuthenticated } from "@/lib/admin-auth";

export type FormState = { error?: string; success?: string } | undefined;

const MIN_PARTICIPANTS = 3;
const MAX_PARTICIPANTS = 100;

// ---------------------------------------------------------------------------
// Anfitrião cria o grupo
// ---------------------------------------------------------------------------
export async function createGroup(_: FormState, form: FormData): Promise<FormState> {
  const name = field(form, "name", 80);
  const hostName = field(form, "hostName", 60);
  const hostEmail = field(form, "hostEmail", 120);
  const description = field(form, "description", 500);
  const budget = field(form, "budget", 40);
  const eventDate = parseDateInput(field(form, "eventDate", 10));
  const hostParticipates = form.get("hostParticipates") === "on";
  const hostWishlist = field(form, "hostWishlist", 1000);

  if (!name) return { error: "Dê um nome ao seu amigo secreto." };
  if (!hostName) return { error: "Informe o seu nome." };
  if (hostEmail && !isEmail(hostEmail)) return { error: "E-mail inválido." };

  const hostToken = secretToken();

  await db.group.create({
    data: {
      name,
      hostName,
      hostEmail: hostEmail || null,
      description: description || null,
      budget: budget || null,
      eventDate,
      inviteCode: inviteCode(),
      hostToken,
      participants: hostParticipates
        ? {
            create: {
              name: hostName,
              email: hostEmail || null,
              wishlist: hostWishlist || null,
              token: secretToken(),
              isHost: true,
            },
          }
        : undefined,
    },
  });

  redirect(`/admin/${hostToken}?novo=1`);
}

// ---------------------------------------------------------------------------
// Participante se inscreve pelo link de convite
// ---------------------------------------------------------------------------
export async function joinGroup(_: FormState, form: FormData): Promise<FormState> {
  const code = field(form, "code", 20);
  const name = field(form, "name", 60);
  const email = field(form, "email", 120);
  const wishlist = field(form, "wishlist", 1000);

  if (!name) return { error: "Informe o seu nome." };
  if (email && !isEmail(email)) return { error: "E-mail inválido." };

  const group = await db.group.findUnique({
    where: { inviteCode: code },
    include: { participants: { select: { name: true } } },
  });
  if (!group) return { error: "Grupo não encontrado." };
  if (group.status !== "OPEN") return { error: "O sorteio deste grupo já foi realizado." };
  if (group.participants.length >= MAX_PARTICIPANTS)
    return { error: "Este grupo atingiu o limite de participantes." };

  const normalized = name.toLocaleLowerCase("pt-BR");
  if (group.participants.some((p) => p.name.toLocaleLowerCase("pt-BR") === normalized)) {
    return {
      error: "Já existe alguém com esse nome no grupo. Use um sobrenome ou apelido.",
    };
  }

  const token = secretToken();
  await db.participant.create({
    data: {
      groupId: group.id,
      name,
      email: email || null,
      wishlist: wishlist || null,
      token,
    },
  });

  redirect(`/p/${token}?novo=1`);
}

// ---------------------------------------------------------------------------
// Participante atualiza sua lista de desejos
// ---------------------------------------------------------------------------
export async function updateWishlist(_: FormState, form: FormData): Promise<FormState> {
  const token = field(form, "token", 60);
  const wishlist = field(form, "wishlist", 1000);

  const p = await db.participant.findUnique({ where: { token } });
  if (!p) return { error: "Participante não encontrado." };

  await db.participant.update({
    where: { id: p.id },
    data: { wishlist: wishlist || null },
  });
  revalidatePath(`/p/${token}`);
  return { success: "Lista de desejos salva! 🎁" };
}

// ---------------------------------------------------------------------------
// Anfitrião remove participante (antes do sorteio)
// ---------------------------------------------------------------------------
export async function removeParticipant(form: FormData): Promise<void> {
  const hostToken = field(form, "hostToken", 60);
  const participantId = field(form, "participantId", 60);

  const group = await db.group.findUnique({ where: { hostToken } });
  if (!group || group.status !== "OPEN") return;

  await db.participant.deleteMany({
    where: { id: participantId, groupId: group.id },
  });
  revalidatePath(`/admin/${hostToken}`);
}

// ---------------------------------------------------------------------------
// Anfitrião realiza o sorteio
// ---------------------------------------------------------------------------
export async function drawGroup(_: FormState, form: FormData): Promise<FormState> {
  const hostToken = field(form, "hostToken", 60);

  const group = await db.group.findUnique({
    where: { hostToken },
    include: { participants: true },
  });
  if (!group) return { error: "Grupo não encontrado." };
  if (group.status !== "OPEN") return { error: "O sorteio já foi realizado." };
  if (group.participants.length < MIN_PARTICIPANTS) {
    return { error: `São necessários pelo menos ${MIN_PARTICIPANTS} participantes.` };
  }

  const pairs = drawSecretFriends(group.participants.map((p) => p.id));

  // Garante atomicidade: ou todos recebem um amigo, ou ninguém recebe.
  const updated = await db.$transaction(async (tx) => {
    const lock = await tx.group.updateMany({
      where: { id: group.id, status: "OPEN" },
      data: { status: "DRAWN", drawnAt: new Date() },
    });
    if (lock.count === 0) return false; // outra requisição sorteou antes

    for (const [giverId, receiverId] of pairs) {
      await tx.participant.update({
        where: { id: giverId },
        data: { assignedToId: receiverId },
      });
    }
    return true;
  });
  if (!updated) return { error: "O sorteio já foi realizado." };

  // E-mails (opcionais) — falhas não desfazem o sorteio.
  const baseUrl = await getBaseUrl();
  const withEmail = group.participants.filter((p) => p.email);
  const results = await Promise.all(
    withEmail.map((p) =>
      sendDrawEmail({
        to: p.email!,
        participantName: p.name,
        groupName: group.name,
        personalUrl: `${baseUrl}/p/${p.token}`,
      }),
    ),
  );
  const sent = results.filter(Boolean).length;

  revalidatePath(`/admin/${hostToken}`);
  return {
    success:
      sent > 0
        ? `Sorteio realizado! ${sent} e-mail(s) enviado(s).`
        : "Sorteio realizado! Envie a cada participante o link pessoal dele.",
  };
}

// ---------------------------------------------------------------------------
// Superadmin: Login e Logout
// ---------------------------------------------------------------------------
export async function loginSuperadmin(_: FormState, form: FormData): Promise<FormState> {
  const secret = field(form, "secret", 100);
  const ok = await setAdminSession(secret);
  if (!ok) {
    return { error: "Senha de administrador incorreta." };
  }
  redirect("/superadmin");
}

export async function logoutSuperadmin(): Promise<void> {
  await clearAdminSession();
  redirect("/superadmin");
}

// ---------------------------------------------------------------------------
// Superadmin: Excluir grupo
// ---------------------------------------------------------------------------
export async function deleteGroupSuperadmin(form: FormData): Promise<void> {
  const isAuth = await isAuthenticated();
  if (!isAuth) return;

  const groupId = field(form, "groupId", 60);
  if (!groupId) return;

  await db.group.delete({ where: { id: groupId } });
  revalidatePath("/superadmin");
}

// ---------------------------------------------------------------------------
// Superadmin: Excluir participante
// ---------------------------------------------------------------------------
export async function deleteParticipantSuperadmin(form: FormData): Promise<void> {
  const isAuth = await isAuthenticated();
  if (!isAuth) return;

  const participantId = field(form, "participantId", 60);
  if (!participantId) return;

  await db.$transaction(async (tx) => {
    // Desvincula quem porventura tirou essa pessoa
    await tx.participant.updateMany({
      where: { assignedToId: participantId },
      data: { assignedToId: null },
    });

    await tx.participant.delete({
      where: { id: participantId },
    });
  });

  revalidatePath("/superadmin");
}

// ---------------------------------------------------------------------------
// Superadmin: Mover participante para outro grupo
// ---------------------------------------------------------------------------
export async function moveParticipantSuperadmin(
  _: FormState,
  form: FormData
): Promise<FormState> {
  const isAuth = await isAuthenticated();
  if (!isAuth) return { error: "Não autorizado." };

  const participantId = field(form, "participantId", 60);
  const targetGroupId = field(form, "targetGroupId", 60);

  if (!participantId || !targetGroupId) {
    return { error: "Participante e grupo de destino são obrigatórios." };
  }

  const participant = await db.participant.findUnique({
    where: { id: participantId },
    include: { group: true },
  });
  if (!participant) return { error: "Participante não encontrado." };

  const targetGroup = await db.group.findUnique({
    where: { id: targetGroupId },
    include: {
      participants: { select: { id: true, name: true } },
    },
  });
  if (!targetGroup) return { error: "Grupo de destino não encontrado." };

  if (targetGroup.id === participant.groupId) {
    return { error: "O participante já pertence a este grupo." };
  }

  if (targetGroup.status !== "OPEN") {
    return {
      error:
        "O grupo de destino já foi sorteado. Só é possível mover para grupos com inscrições abertas.",
    };
  }

  if (targetGroup.participants.length >= MAX_PARTICIPANTS) {
    return { error: "O grupo de destino atingiu o limite de participantes." };
  }

  const normalized = participant.name.toLocaleLowerCase("pt-BR");
  if (
    targetGroup.participants.some(
      (p) => p.name.toLocaleLowerCase("pt-BR") === normalized
    )
  ) {
    return {
      error: `Já existe um participante com o nome "${participant.name}" no grupo de destino.`,
    };
  }

  // Se o grupo de origem já havia sido sorteado, desfaz o vínculo de sorteio dele
  await db.$transaction(async (tx) => {
    // Se alguém tirou esse participante no grupo antigo, desvincula
    await tx.participant.updateMany({
      where: { assignedToId: participant.id },
      data: { assignedToId: null },
    });

    // Move para o novo grupo e zera o assignedToId
    await tx.participant.update({
      where: { id: participant.id },
      data: {
        groupId: targetGroup.id,
        isHost: false, // não é host no novo grupo
        assignedToId: null,
      },
    });
  });

  revalidatePath("/superadmin");
  return {
    success: `"${participant.name}" foi movido com sucesso para "${targetGroup.name}"!`,
  };
}
