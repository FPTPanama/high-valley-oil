import { SITE_URL, OG_IMAGE } from "./site";

type OrganizationJsonLdProps = {
  name: string;
  description: string;
};

export function OrganizationJsonLd({
  name,
  description,
}: OrganizationJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    legalName: name,
    url: SITE_URL,
    description,
    logo: `${SITE_URL}/images/high_valley_2_canvas.svg`,
    image: `${SITE_URL}${OG_IMAGE.url}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "1925 Lovering Avenue",
      addressLocality: "Wilmington",
      addressRegion: "DE",
      postalCode: "19806",
      addressCountry: "US",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
