import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "./config";
import type { PageKey } from "./pages";

export type Dictionary = {
  meta: {
    siteName: string;
    brandName: string;
    description: string;
  };
  nav: Record<PageKey | "main" | "language", string>;
  language: Record<Locale, string>;
  home: {
    hero: {
      title: string[];
      subtitle: string;
      cta: string;
    };
    company: {
      index: string;
      eyebrow: string;
      title: string[];
      lead: string;
      body: string;
      cta: string;
    };
    business: {
      index: string;
      eyebrow: string;
      title: string[];
      subtitle: string[];
      focuses: {
        index: string;
        label: string;
        lead: string;
        blocks: { title: string; info: string; icon: string }[];
      }[];
    };
    services: {
      index: string;
      eyebrow: string;
      title: string;
      body: string;
      itemAction: string;
      feature: {
        title: string;
        body: string;
        slug: string;
      };
      items: {
        index: string;
        title: string;
        slug: string;
        icon: string;
        body: string;
        points: string[];
      }[];
    };
    venezuela: {
      index: string;
      eyebrow: string;
      title: string;
      body: string;
      cta: string;
    };
    approach: {
      index: string;
      eyebrow: string;
      title: string;
      steps: {
        index: string;
        title: string;
        cta: string;
      }[];
    };
  };
  servicesPage: {
    eyebrow: string;
    title: string[];
    lead: string;
  };
  businessPage: {
    eyebrow: string;
    title: string[];
    lead: string;
    intro: {
      eyebrow: string;
      title: string;
      body: string;
    };
    focusesEyebrow: string;
    method: {
      eyebrow: string;
      title: string;
      steps: {
        index: string;
        title: string;
        body: string;
      }[];
    };
    cta: {
      eyebrow: string;
      title: string;
      body: string;
      label: string;
    };
  };
  venezuelaPage: {
    eyebrow: string;
    title: string[];
    lead: string;
    steps: {
      index: string;
      title: string;
      body: string;
    }[];
  };
  venezuelaFieldToMarket: {
    eyebrow: string;
    lines: string[];
    stages: string[];
  };
  companyPage: {
    eyebrow: string;
    title: string[];
    lead: string;
    intro: {
      eyebrow: string;
      title: string;
      body: string;
      ctaLabel: string;
    };
    principles: {
      index: string;
      eyebrow: string;
      title: string;
      items: {
        index: string;
        title: string;
        cta: string;
      }[];
    };
    presence: {
      eyebrow: string;
      title: string;
      body: string;
      points: {
        title: string;
        body: string;
      }[];
    };
    cta: {
      eyebrow: string;
      title: string;
      body: string;
      label: string;
    };
  };
  contactPage: {
    eyebrow: string;
    title: string;
    submitLabel: string;
    fields: {
      id: string;
      label: string;
      name: string;
      type: "text" | "email" | "textarea";
      autoComplete?: string;
      required?: boolean;
    }[];
  };
  footer: {
    eyebrow: string;
    headline: string;
    cta: string;
    addressLabel: string;
    addressLines: string[];
    addressCountry: string;
    company: string[];
    copyrightOwner: string;
  };
  notFound: {
    title: string;
  };
};

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () =>
    import("./dictionaries/en.json").then(
      (module) => module.default as Dictionary,
    ),
  es: () =>
    import("./dictionaries/es.json").then(
      (module) => module.default as Dictionary,
    ),
};

export function loadDictionary(locale: Locale) {
  return dictionaries[locale]();
}

export async function getDictionary() {
  const locale = await lang();
  if (!isLocale(locale)) notFound();
  return loadDictionary(locale);
}
