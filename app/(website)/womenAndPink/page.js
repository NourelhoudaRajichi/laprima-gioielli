import { getAllAuthors, getSettings } from "@/lib/sanity/client";
import Women from "./women";

export default async function AboutPage() {
  const authors = await getAllAuthors();
  const settings = await getSettings();
  return <Women settings={settings} authors={authors} />;
}

