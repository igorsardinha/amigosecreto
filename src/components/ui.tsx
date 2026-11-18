import type { FormState } from "@/app/actions";

export function FormMessage({ state }: { state: FormState }) {
  if (!state) return null;
  if (state.error)
    return (
      <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
        {state.error}
      </p>
    );
  if (state.success)
    return (
      <p role="status" className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-800">
        {state.success}
      </p>
    );
  return null;
}

export function GroupInfo({
  description,
  budget,
  eventDate,
}: {
  description?: string | null;
  budget?: string | null;
  eventDate?: string | null;
}) {
  if (!description && !budget && !eventDate) return null;
  return (
    <div className="space-y-2 text-sm text-stone-700">
      {description && <p className="whitespace-pre-line">{description}</p>}
      <div className="flex flex-wrap gap-2">
        {eventDate && <span className="chip">📅 {eventDate}</span>}
        {budget && <span className="chip">💰 {budget}</span>}
      </div>
    </div>
  );
}
