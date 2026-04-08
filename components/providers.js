"use client";

import { CartProvider } from "./Context";

export default function Providers({ children }) {
  return <CartProvider>{children}</CartProvider>;
}