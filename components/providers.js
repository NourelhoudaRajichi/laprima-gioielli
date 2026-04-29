"use client";

import { CartProvider } from "./Context";
import { CurrencyProvider } from "./CurrencyContext";

export default function Providers({ children }) {
  return (
    <CurrencyProvider>
      <CartProvider>{children}</CartProvider>
    </CurrencyProvider>
  );
}