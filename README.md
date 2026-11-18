# 🎁 Amigo Secreto — Sorteador online

O anfitrião cria um grupo, compartilha o link de convite, os participantes se inscrevem
sozinhos e, no sorteio, cada pessoa descobre quem tirou pelo seu **link pessoal**
(e opcionalmente recebe um aviso por e-mail).

**Stack:** Next.js 16 (App Router, Server Actions) · TypeScript · Tailwind CSS 4 · Prisma 6
(SQLite em dev, Postgres/Neon em produção) · Resend (e-mail opcional).

## Como funciona

| Rota | Quem acessa | O que faz |
|---|---|---|
| `/` | Anfitrião | Cria o grupo (nome, data, valor sugerido, recado). Pode participar também. |
| `/admin/[hostToken]` | Anfitrião | Link de convite (copiar/WhatsApp), lista e remoção de participantes, botão de sorteio, quem já viu o resultado. |
| `/g/[inviteCode]` | Convidados | Inscrição com nome, e-mail opcional e lista de desejos. |
| `/p/[token]` | Cada participante | Aguarda o sorteio → revela o amigo secreto e a lista de desejos dele; edita a própria lista. |

- **Sem login:** o acesso é por tokens aleatórios e não adivinháveis nos links.
- **Sorteio:** embaralhamento Fisher–Yates com RNG criptográfico formando um ciclo único —
  ninguém tira a si mesmo ([src/lib/draw.ts](src/lib/draw.ts), testado em [tests/draw.test.ts](tests/draw.test.ts)).
- **Atômico:** o sorteio roda em transação; dois cliques simultâneos não geram dois sorteios.
- **E-mail:** contém só o link pessoal, nunca o nome sorteado.
- Mínimo de 3 participantes; nomes duplicados são bloqueados; inscrições fecham após o sorteio.

## Rodando localmente

```bash
npm install          # também roda `prisma generate`
cp .env.example .env # DATABASE_URL="file:./dev.db"
npm run db:push      # cria o banco SQLite
npm run dev          # http://localhost:3000
npm test             # testes do algoritmo de sorteio
```

## Deploy na Vercel (Postgres/Neon)

1. Importe o repositório na Vercel.
2. Em **Storage / Marketplace**, adicione **Neon Postgres** ao projeto — isso cria
   `DATABASE_URL` e `DATABASE_URL_UNPOOLED`.
3. (Opcional) defina `RESEND_API_KEY` e `EMAIL_FROM` para enviar e-mails, e
   `NEXT_PUBLIC_APP_URL` com o domínio final.
4. Faça o deploy. O script `vercel-build` usa `prisma/postgres/schema.prisma`, sincroniza o
   schema no banco (`prisma db push`) e faz o build.

> Os dois schemas (`prisma/schema.prisma` e `prisma/postgres/schema.prisma`) precisam ter
> os mesmos models — só o `datasource` muda.
