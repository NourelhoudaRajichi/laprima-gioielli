import { getAllAuthors, getSettings } from "@/lib/sanity/client";
import ConditionOfSale from "./conditionOfSale";

export default async function ConditionOfSalePage() {
  const authors = await getAllAuthors();
  const settings = await getSettings();
  return <ConditionOfSale settings={settings} authors={authors} />;
}

// export const revalidate = 60;
