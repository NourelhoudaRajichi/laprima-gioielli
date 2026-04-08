import { getAllAuthors, getSettings } from "@/lib/sanity/client";
import DetailedPage from "./detailedPage";

export default async function detailPage() {
  const authors = await getAllAuthors();
  const settings = await getSettings();
  return <DetailedPage settings={settings} authors={authors} />;
}

// export const revalidate = 60;
