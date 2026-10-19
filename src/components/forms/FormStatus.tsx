import { startTransition, type FormEvent } from "react";
import type { LeadResult } from "@/lib/leads/types";

/** Error banner for a form result: `.ui-form-status[data-state=error]` with role="alert". */
export default function FormStatus({ state, className }: { state: LeadResult; className?: string }) {
  if (state.status !== "error" || !state.message) return null;
  return <p className={`ui-form-status${className ? ` ${className}` : ""}`} data-state="error" role="alert">{state.message}</p>;
}

/** Inline error under one field. Pair with fieldA11y() on the control. */
export function FieldError({ id, state, name }: { id: string; state: LeadResult; name: string }) {
  const message = state.fieldErrors?.[name];
  return message ? <span className="ui-field-error" id={`${id}-error`}>{message}</span> : null;
}

/** aria-invalid + aria-describedby for a control whose id is `id` and form field is `name`. */
export function fieldA11y(state: LeadResult, id: string, name: string) {
  const invalid = Boolean(state.fieldErrors?.[name]);
  return { "aria-invalid": invalid || undefined, "aria-describedby": invalid ? `${id}-error` : undefined } as const;
}

/**
 * onSubmit handler that runs a useActionState action without React's automatic form reset,
 * so typed values survive a validation error. Keep `action={formAction}` on the <form> as well
 * (progressive enhancement when JS is unavailable).
 */
export function submitWithoutReset(formAction: (formData: FormData) => void) {
  return (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
  };
}
