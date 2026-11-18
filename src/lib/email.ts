/**
 * Envio de e-mail opcional via Resend (API REST, sem SDK).
 * Se RESEND_API_KEY / EMAIL_FROM não estiverem definidos, o envio é ignorado.
 */
export function emailEnabled(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
}

type DrawEmail = {
  to: string;
  participantName: string;
  groupName: string;
  personalUrl: string;
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendDrawEmail(data: DrawEmail): Promise<boolean> {
  if (!emailEnabled()) return false;

  // Por segurança o e-mail NÃO contém o nome sorteado — apenas o link pessoal.
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto">
      <h2 style="color:#b91c1c">🎁 O sorteio foi realizado!</h2>
      <p>Olá, <strong>${escapeHtml(data.participantName)}</strong>!</p>
      <p>O sorteio do amigo secreto <strong>${escapeHtml(data.groupName)}</strong> acabou de acontecer.</p>
      <p>
        <a href="${data.personalUrl}"
           style="display:inline-block;background:#b91c1c;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none">
          Ver quem eu tirei
        </a>
      </p>
      <p style="color:#666;font-size:12px">Não compartilhe este link: ele é só seu.</p>
    </div>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM,
        to: [data.to],
        subject: `🎁 Amigo secreto "${data.groupName}": veja quem você tirou`,
        html,
      }),
    });
    if (!res.ok) console.error("Falha ao enviar e-mail:", res.status, await res.text());
    return res.ok;
  } catch (err) {
    console.error("Erro ao enviar e-mail:", err);
    return false;
  }
}
