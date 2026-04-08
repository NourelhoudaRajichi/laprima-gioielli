import { getSettings } from "@/lib/sanity/client";
import PrivateAreaLogin from "./privateAreaLogin";

export default async function PrivateAreaLoginPage() {
  const settings = await getSettings();
  return <PrivateAreaLogin settings={settings} />;
}

// export const revalidate = 60;
