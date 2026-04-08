import { getAllAuthors, getSettings } from "@/lib/sanity/client";
import Bloomy from "./bloomy";

export default async function AboutPage() {
  const authors = await getAllAuthors();
  const settings = await getSettings();
  return <Bloomy settings={settings} authors={authors} />;
}

// export const revalidate = 60;
