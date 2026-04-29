import { getSettings } from "@/lib/sanity/client";
import Profile from "./profile";

export default async function ProfilePage() {
  const settings = await getSettings();
  return <Profile settings={settings} />;
}

