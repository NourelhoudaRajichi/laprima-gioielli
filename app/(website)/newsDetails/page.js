import { getSettings } from "@/lib/sanity/client";
import NewsDetails from "./newsDetails";

export default async function NewsDetailsPage() {
  const settings = await getSettings();
  return <NewsDetails settings={settings} />;
}

