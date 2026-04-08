import { getAllAuthors, getSettings } from "@/lib/sanity/client";
import StonePage from "./stonePage";

export default async function stonePage() {
  const authors = await getAllAuthors();
  const settings = await getSettings();
  return <StonePage settings={settings} authors={authors} />;
}

// export const revalidate = 60;
