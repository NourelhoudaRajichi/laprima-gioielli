import { getAllAuthors, getSettings } from "@/lib/sanity/client";
import Boutique from "./boutique";

export default async function BoutiquePage() {
  const authors = await getAllAuthors();
  const settings = await getSettings();
  return <Boutique settings={settings} authors={authors} />;
}

// export const revalidate = 60;
