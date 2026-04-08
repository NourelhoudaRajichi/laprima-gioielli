import { getSettings } from "@/lib/sanity/client";
import Jewels from "./jewelsCare";

export default async function JewelsCarePage() {
  const settings = await getSettings();
  return <Jewels settings={settings} />;
}

// export const revalidate = 60;
