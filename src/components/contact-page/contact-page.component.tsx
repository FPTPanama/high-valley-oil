import {
  contentFrame,
  contentInset,
  sectionShell,
} from "@/components/general-layout";
import { SiteButton } from "@/components/site-button";

export type ContactPageField = {
  id: string;
  label: string;
  name: string;
  type: "text" | "email" | "textarea";
  autoComplete?: string;
  required?: boolean;
};

export type ContactPageProps = {
  eyebrow: string;
  title: string;
  fields: ContactPageField[];
  submitLabel: string;
};

const fieldClassName =
  "w-full border border-ink/20 bg-canvas px-3 py-2 text-sm font-light tracking-[0.02em] text-ink outline-none transition-colors placeholder:text-ink/40 focus-visible:border-accent";

export function ContactPageContent({
  eyebrow,
  title,
  fields,
  submitLabel,
}: ContactPageProps) {
  return (
    <section
      aria-labelledby="contact-heading"
      className={`${sectionShell} overflow-hidden bg-canvas`}
    >
      <div
        className={`${contentFrame} ${contentInset} relative z-10 flex flex-1 flex-col justify-center py-10 mt-40 sm:mt-48 sm:py-12`}
      >
        <div className="grid w-full gap-12 lg:grid-cols-2 lg:items-stretch lg:gap-16 xl:gap-20">
          <header className="flex max-w-xl flex-col justify-center gap-5 text-left text-ink lg:h-full">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
              {eyebrow}
            </p>
            <h1
              id="contact-heading"
              className="text-3xl font-light tracking-[0.04em] text-balance uppercase sm:text-4xl lg:text-5xl"
            >
              {title}
            </h1>
          </header>

          <form
            className="flex w-full max-w-xl flex-col justify-center gap-4 lg:max-w-none lg:justify-self-stretch"
            action="#"
            method="post"
            noValidate
          >
            {fields.map((field) => (
              <label
                key={field.id}
                className="flex flex-col gap-1.5"
                htmlFor={field.id}
              >
                <span className="text-sm font-medium tracking-[0.02em] text-ink">
                  {field.label}
                </span>
                {field.type === "textarea" ? (
                  <textarea
                    id={field.id}
                    name={field.name}
                    rows={4}
                    required={field.required}
                    className={`${fieldClassName} min-h-24 resize-y`}
                  />
                ) : (
                  <input
                    id={field.id}
                    name={field.name}
                    type={field.type}
                    autoComplete={field.autoComplete}
                    required={field.required}
                    className={fieldClassName}
                  />
                )}
              </label>
            ))}

            <div className="pt-1">
              <SiteButton type="submit" layout="spread">
                {submitLabel}
              </SiteButton>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
