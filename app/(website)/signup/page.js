import { getSettings } from "@/lib/sanity/client";
import Sing from "./signup";

export default async function SignPage() {
  const settings = await getSettings();
  return <Sing settings={settings} />;
}

