import { getAllAuthors, getSettings } from "@/lib/sanity/client";
import Faqs from "./faqs";

export default async function FaqsPage() {
  const authors = await getAllAuthors();
  const settings = await getSettings();
  return <Faqs settings={settings} authors={authors} />;
}

// export const revalidate = 60;
