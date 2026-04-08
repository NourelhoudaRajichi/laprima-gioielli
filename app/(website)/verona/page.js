import { getAllAuthors, getSettings } from "@/lib/sanity/client";
import Verona from "./verona";

export default async function VeronaPage() {
  const authors = await getAllAuthors();
  const settings = await getSettings();
  return <Verona settings={settings} authors={authors} />;
}

// export const revalidate = 60;
