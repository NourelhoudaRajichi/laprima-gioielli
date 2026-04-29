import { getSettings } from "@/lib/sanity/client";
import Cookies from "./cookies";

export default async function CookiesPage() {
  const settings = await getSettings();
  return <Cookies settings={settings} />;
}

