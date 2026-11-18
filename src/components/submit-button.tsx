"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({
  children,
  pendingText = "Aguarde…",
  className = "",
  confirmMessage,
  variant = "btn-primary",
  ariaLabel,
}: {
  children: React.ReactNode;
  pendingText?: string;
  className?: string;
  confirmMessage?: string;
  variant?: string;
  ariaLabel?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-label={ariaLabel}
      onClick={(e) => {
        if (confirmMessage && !window.confirm(confirmMessage)) e.preventDefault();
      }}
      className={`${variant} ${className}`}
    >
      {pending ? pendingText : children}
    </button>
  );
}
