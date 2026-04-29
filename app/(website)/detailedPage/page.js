import { Suspense } from "react";
import DetailedPage from "./detailedPage";

export default function DetailPage() {
  return (
    <Suspense>
      <DetailedPage />
    </Suspense>
  );
}
