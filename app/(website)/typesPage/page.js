import { getAllAuthors, getSettings } from "@/lib/sanity/client";
import TypesPage from "./typesPage";

export default async function typesPage() {
  const authors = await getAllAuthors();
  const settings = await getSettings();
  return <TypesPage settings={settings} authors={authors} />;
}

// export const revalidate = 60;
