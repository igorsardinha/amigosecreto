"use client";

import { useState } from "react";

export function CopyButton({
  text,
  label = "Copiar",
  className = "btn-secondary",
}: {
  text: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className={className}
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
    >
      {copied ? "Copiado! ✓" : label}
    </button>
  );
}

/** Campo somente-leitura com o link + botão de copiar + compartilhar no WhatsApp. */
export function ShareLink({
  url,
  whatsappText,
}: {
  url: string;
  whatsappText?: string;
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <input
        readOnly
        value={url}
        aria-label="Link"
        onFocus={(e) => e.currentTarget.select()}
        className="input flex-1 font-mono text-sm"
      />
      <div className="flex gap-2">
        <CopyButton text={url} label="Copiar link" />
        {whatsappText && (
          <a
            className="btn-whatsapp"
            target="_blank"
            rel="noopener noreferrer"
            href={`https://wa.me/?text=${encodeURIComponent(`${whatsappText}\n${url}`)}`}
          >
            WhatsApp
          </a>
        )}
      </div>
    </div>
  );
}
