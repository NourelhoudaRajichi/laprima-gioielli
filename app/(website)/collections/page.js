import { getCollections } from "@/lib/wordpress/api";
import Collections from "./collections";

export const revalidate = 60;

export default async function CollectionsPage() {
  const collections = await getCollections(20).catch(() => null);
  return <Collections collections={collections ?? null} />;
}
