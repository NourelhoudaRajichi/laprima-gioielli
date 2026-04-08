import { getSettings } from "@/lib/sanity/client";
import Key from "./keyVisual";

export default async function KeyPage() {
  const settings = await getSettings();
  return <Key settings={settings} />;
}

// export const revalidate = 60;
