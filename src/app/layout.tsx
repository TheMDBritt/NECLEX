import type { Metadata } from "next";
import { Fraunces, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  axes: ["opsz", "SOFT"],
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "600"],
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "NECLEX — A calmer way to study for the NCLEX",
    template: "%s · NECLEX",
  },
  description:
    "An NCLEX prep companion built around how you actually learn. Calm, accurate, and quietly relentless about getting you ready.",
  keywords: ["NCLEX", "NCLEX-RN", "NCLEX-PN", "nursing", "nursing exam", "study", "NGN"],
  authors: [{ name: "NECLEX" }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  openGraph: {
    title: "NECLEX — A calmer way to study for the NCLEX",
    description:
      "An NCLEX prep companion built around how you actually learn. Calm, accurate, and quietly relentless about getting you ready.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${instrumentSans.variable} ${jetBrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
