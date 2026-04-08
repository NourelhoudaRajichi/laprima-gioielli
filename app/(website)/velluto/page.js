import { getAllAuthors, getSettings } from "@/lib/sanity/client";
import Velluto from "./velluto";

export default async function VeronaPage() {
  const authors = await getAllAuthors();
  const settings = await getSettings();
  return <Velluto settings={settings} authors={authors} />;
}

// export const revalidate = 60;
