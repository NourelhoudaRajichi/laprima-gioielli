import { getAllAuthors, getSettings } from "@/lib/sanity/client";
import PrivacyPolicy from "./privacyPolicy";

export default async function PrivacyPolicyPage() {
  const authors = await getAllAuthors();
  const settings = await getSettings();
  return <PrivacyPolicy settings={settings} authors={authors} />;
}

// export const revalidate = 60;
