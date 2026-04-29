"use client";
import { useEffect } from "react";

export default function TrackPageView() {
  useEffect(() => {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page: "website" }),
    }).catch(() => {});
  }, []);
  return null;
}
