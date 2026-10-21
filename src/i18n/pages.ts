export const pages = [
  { path: "/our-company", key: "ourCompany" },
  { path: "/our-business", key: "ourBusiness" },
  { path: "/services", key: "services" },
  { path: "/venezuela", key: "venezuela" },
  { path: "/contact", key: "contact" },
] as const;

export type PageKey = (typeof pages)[number]["key"];
