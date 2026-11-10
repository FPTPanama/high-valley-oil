"use client";

import { useActionState } from "react";
import { SiteButton } from "@/components/site-button";
import { submitContact, type ContactFormState } from "@/contact/submit-contact";

export type ContactFormField = {
  id: string;
  label: string;
  name: string;
  type: "text" | "email" | "textarea";
  autoComplete?: string;
  required?: boolean;
};

export type ContactFormProps = {
  fields: ContactFormField[];
  submitLabel: string;
  sendingLabel: string;
  errorMessage: string;
  locale: string;
};

const initialState: ContactFormState = { status: "idle" };

const fieldClassName =
  "w-full border border-canvas bg-transparent px-3 py-2 text-sm font-light tracking-[0.02em] text-canvas outline-none transition-colors placeholder:text-canvas/40 focus-visible:border-accent";

export function ContactForm({
  fields,
  submitLabel,
  sendingLabel,
  errorMessage,
  locale,
}: ContactFormProps) {
  const [state, formAction, pending] = useActionState(
    submitContact,
    initialState,
  );

  return (
    <form
      className="relative flex flex-col justify-center gap-4"
      action={formAction}
      noValidate
    >
      <input type="hidden" name="locale" value={locale} />

      {/* Honeypot — hidden from people, filled by many bots. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0"
      />

      {fields.map((field) => (
        <label
          key={field.id}
          className="flex flex-col gap-1.5"
          htmlFor={field.id}
        >
          <span className="text-sm font-bold tracking-[0.02em] text-canvas">
            {field.label}
          </span>
          {field.type === "textarea" ? (
            <textarea
              id={field.id}
              name={field.name}
              rows={4}
              required={field.required}
              disabled={pending}
              className={`${fieldClassName} min-h-24 resize-y disabled:opacity-60`}
            />
          ) : (
            <input
              id={field.id}
              name={field.name}
              type={field.type}
              autoComplete={field.autoComplete}
              required={field.required}
              disabled={pending}
              className={`${fieldClassName} disabled:opacity-60`}
            />
          )}
        </label>
      ))}

      <div className="pt-1">
        <SiteButton
          type="submit"
          layout="spread"
          className="w-full"
          disabled={pending}
        >
          {pending ? sendingLabel : submitLabel}
        </SiteButton>
      </div>

      {state.status === "error" ? (
        <p
          role="alert"
          className="text-sm font-medium tracking-[0.02em] text-accent"
        >
          {errorMessage}
        </p>
      ) : pending ? (
        <p
          role="status"
          aria-live="polite"
          className="text-sm tracking-[0.02em] text-canvas/80"
        >
          {sendingLabel}
        </p>
      ) : null}
    </form>
  );
}
