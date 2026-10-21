import { PageHeading } from "@/components/page-heading";
import { getDictionary } from "@/i18n/dictionaries";

export default async function HomePage() {
  const dict = await getDictionary();

  return <PageHeading title={dict.meta.siteName} />;
}
