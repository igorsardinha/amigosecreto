import Link from "next/link";

export default function NotFound() {
  return (
    <div className="card mt-8 text-center">
      <p className="text-5xl">🔍</p>
      <h1 className="mt-2 text-xl font-bold">Link não encontrado</h1>
      <p className="mt-1 text-stone-600">Confira se o link foi copiado corretamente.</p>
      <Link href="/" className="btn-primary mt-4">Criar um amigo secreto</Link>
    </div>
  );
}
