import { getAllAuthors, getSettings } from "@/lib/sanity/client";
import Checkout from "./checkout";

export default async function CheckoutPage() {
  const authors = await getAllAuthors();
  const settings = await getSettings();
  return <Checkout settings={settings} authors={authors} />;
}

