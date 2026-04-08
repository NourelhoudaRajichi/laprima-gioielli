import { getAllAuthors, getSettings } from "@/lib/sanity/client";
import Prestige from "./prestige";

export default async function AboutPage() {
  const authors = await getAllAuthors();
  const settings = await getSettings();
  return <Prestige settings={settings} authors={authors} />;
}

// export const revalidate = 60;
