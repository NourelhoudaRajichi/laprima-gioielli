import { getAllAuthors, getSettings } from "@/lib/sanity/client";
import Jewels from "./jewels";

export default async function JewelsPage() {
  const authors = await getAllAuthors();
  const settings = await getSettings();
  return <Jewels settings={settings} authors={authors} />;
}

// export const revalidate = 60;
