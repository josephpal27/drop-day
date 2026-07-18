import "./globals.css";
import { Oswald, Inter, JetBrains_Mono } from "next/font/google";
import { DropProvider } from "@/context/DropContext";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-display",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-jetbrains-mono",
});

export const metadata = {
  title: "Drop Day - Flash Sale Storefront",
  description: "Here's the season's best flash sale storefront is live.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${oswald.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        <DropProvider>{children}</DropProvider>
      </body>
    </html>
  );
}