import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { fetchMelissaProducts } from "@/lib/woo/fetchMelissaProducts";
import VipPage from "./vip";

export default async function Page({ searchParams }) {
  const { ref } = await searchParams;
  const cookieStore = await cookies();
  const agentCookie = cookieStore.get("lpg_agent_ref")?.value;

  if (!ref && !agentCookie) redirect("/");

  const { products, allCats } = await fetchMelissaProducts().catch(() => ({ products: [], allCats: [] }));
  return (
    <Suspense>
      <VipPage products={products} allCats={allCats} />
    </Suspense>
  );
}
