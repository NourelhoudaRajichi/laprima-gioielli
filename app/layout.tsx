// import "@/styles/tailwind.css";
// import { Providers } from "./providers";
// import { cx } from "@/utils/all";
// import { Inter, Lora ,Barlow_Condensed  } from "next/font/google";
 

// const barlow = Barlow_Condensed
// ({ subsets: ['latin'], 
//    weight: ['400','500','600'] ,
//     variable: "--font-barlow",

// }); 
// const inter = Inter({
//   subsets: ["latin"],
//   variable: "--font-inter"
// });

// const lora = Lora({
//   subsets: ["latin"],
//   variable: "--font-lora"
// });

// export default function RootLayout({
//   children
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html
//       lang="en"
//       suppressHydrationWarning
//       className={cx(inter.variable, lora.variable, barlow.variable)}>
//       <body className="antialiased text-gray-800 dark:bg-black dark:text-gray-400">
//         <Providers>{children}</Providers>
//       </body>
//     </html>
//   );
// }


import "@/styles/tailwind.css";
import { Providers } from "./providers";
import { CartProvider } from "../components/Context";
import { cx } from "@/utils/all";
import { Inter, Lora } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora"
});

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cx(inter.variable, lora.variable)}>
      <body className="antialiased text-gray-800 dark:bg-black dark:text-gray-400">
        <CartProvider>
          <Providers>{children}</Providers>
        </CartProvider>
      </body>
    </html>
  );
}