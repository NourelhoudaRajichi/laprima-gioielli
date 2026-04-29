import { getAllAuthors, getSettings } from "@/lib/sanity/client";
import VeronaPrestige from "./veronaprestige";

export default async function AboutPage() {
  const authors = await getAllAuthors();
  const settings = await getSettings();
  return <VeronaPrestige settings={settings} authors={authors} />;
}

