import News from "./news";

export const revalidate = 60;

const WP_BASE =
  process.env.WP_BASE_URL ||
  (process.env.NEXT_PUBLIC_WP_GRAPHQL_URL || "").replace(/\/graphql\/?$/, "");

export default async function NewsPage() {
  let posts = null;
  try {
    const res = await fetch(
      `${WP_BASE}/wp-json/wp/v2/posts?per_page=20&_embed=1`,
      { next: { revalidate: 60 } }
    );
    if (res.ok) posts = await res.json();
  } catch {
    // falls back to hardcoded data in the component
  }
  return <News posts={posts} />;
}
