import { contentFramePadded } from "@/components/general-layout";

export type ServicesPageItem = {
  index: string;
  title: string;
  slug: string;
  body: string;
  points: string[];
};

export type ServicesPageProps = {
  items: ServicesPageItem[];
};

export function ServicesPageContent({ items }: ServicesPageProps) {
  return (
    <div
      className={`${contentFramePadded} flex flex-col gap-0 pb-8 sm:pb-12 lg:pb-16`}
    >
      {items.map((item) => (
        <section
          key={item.slug}
          id={item.slug}
          aria-labelledby={`services-${item.slug}-heading`}
          className="scroll-mt-40 border-t border-ink/20 py-12 sm:scroll-mt-44 sm:py-16"
        >
          <div className="grid gap-6 lg:grid-cols-[auto_1fr] lg:gap-12">
            <span className="text-sm font-semibold tracking-[0.2em] text-accent">
              {item.index}
            </span>
            <div className="flex max-w-3xl flex-col gap-6">
              <div className="flex flex-col gap-4">
                <h2
                  id={`services-${item.slug}-heading`}
                  className="text-2xl font-light tracking-[0.04em] text-balance uppercase sm:text-3xl"
                >
                  {item.title}
                </h2>
                <p className="text-base font-normal leading-relaxed tracking-[0.02em] text-ink/80 sm:text-lg">
                  {item.body}
                </p>
              </div>
              <ul className="flex flex-col gap-3 border-t border-ink/15 pt-6">
                {item.points.map((point) => (
                  <li
                    key={point}
                    className="flex gap-3 text-base font-light leading-snug tracking-[0.02em] text-ink sm:text-lg"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-2 size-1.5 shrink-0 rounded-full bg-accent"
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
