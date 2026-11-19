import { CreateGroupForm } from "./create-group-form";
import { RecoverBanner } from "@/components/recover-banner";

export default function Home() {
  return (
    <div className="space-y-6">
      <RecoverBanner />

      <section className="py-4 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl">
          Sorteie seu <span className="text-red-700">amigo secreto</span> online
        </h1>
        <p className="mt-3 text-stone-600">
          Crie o grupo, envie o link para a turma e, quando todos se inscreverem,
          faça o sorteio. Cada um descobre quem tirou no seu link pessoal.
        </p>
      </section>

      <ol className="grid gap-3 text-sm sm:grid-cols-3">
        {[
          ["1", "Crie o grupo", "Defina data e valor sugerido."],
          ["2", "Compartilhe o link", "Os amigos se inscrevem sozinhos."],
          ["3", "Sorteie!", "Cada um vê só o seu amigo secreto."],
        ].map(([n, t, d]) => (
          <li key={n} className="card p-4">
            <span className="mb-1 inline-flex size-6 items-center justify-center rounded-full bg-red-700 text-xs font-bold text-white">
              {n}
            </span>
            <p className="font-semibold">{t}</p>
            <p className="text-stone-600">{d}</p>
          </li>
        ))}
      </ol>

      <section className="card">
        <h2 className="mb-4 text-xl font-bold">Criar novo amigo secreto</h2>
        <CreateGroupForm />
      </section>
    </div>
  );
}
