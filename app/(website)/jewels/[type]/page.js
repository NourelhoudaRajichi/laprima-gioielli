import { fetchWooProducts } from "@/lib/woo/fetchProducts";
import JewelTypePage from "./jewel-type-page";

export default async function Page({ params }) {
  const { type } = await params;
  const products = await fetchWooProducts(type).catch(() => []);
  return <JewelTypePage type={type} initialProducts={products} />;
}
