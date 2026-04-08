import { getAllAuthors, getSettings } from "@/lib/sanity/client";
import BloomyPrestige from "./bloomyprestige";

export default async function AboutPage() {
  const authors = await getAllAuthors();
  const settings = await getSettings();
  return <BloomyPrestige settings={settings} authors={authors} />;
}

// export const revalidate = 60;
