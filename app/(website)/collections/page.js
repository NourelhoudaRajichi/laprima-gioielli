import { getSettings } from "@/lib/sanity/client";
import Collections from "./collections";

export default async function CollectionsPage() {
  const settings = await getSettings();
  return <Collections settings={settings} />;
}

// export const revalidate = 60;
