import { getSettings } from "@/lib/sanity/client";
import News from "./news";

export default async function NewsPage() {
  const settings = await getSettings();
  return <News settings={settings} />;
}

// export const revalidate = 60;