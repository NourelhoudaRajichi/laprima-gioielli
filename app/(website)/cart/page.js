import { getAllAuthors, getSettings } from "@/lib/sanity/client";
import Cart from "./cart";

export default async function CartPage() {
  const authors = await getAllAuthors();
  const settings = await getSettings();
  return <Cart settings={settings} authors={authors} />;
}

