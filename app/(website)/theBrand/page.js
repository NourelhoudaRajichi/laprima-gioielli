import { getAllAuthors, getSettings } from "@/lib/sanity/client";
import Brand from "./brand";

export default async function AboutPage() {
  const authors = await getAllAuthors();
  const settings = await getSettings();
  return <Brand settings={settings} authors={authors} />;
}

// export const revalidate = 60;
