import { getAllAuthors, getSettings } from "@/lib/sanity/client";
import Terms from "./terms";

export default async function TermsPage() {
  const authors = await getAllAuthors();
  const settings = await getSettings();
  return <Terms settings={settings} authors={authors} />;
}

