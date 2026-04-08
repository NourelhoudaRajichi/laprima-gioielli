// app/private/page.jsx
import { getSettings } from "@/lib/sanity/client";
import Private from "./privateArea";

export default async function PrivatePage() {
  const settings = await getSettings();
  return (
    <div className="private-page">
      <Private settings={settings} />
    </div>
  );
}

// export const revalidate = 60;
