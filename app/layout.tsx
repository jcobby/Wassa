import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const display = localFont({
  variable: "--font-display",
  src: [
    { path: "./fonts/fraunces-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/fraunces-400-italic.woff2", weight: "400", style: "italic" },
    { path: "./fonts/fraunces-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/fraunces-600-italic.woff2", weight: "600", style: "italic" },
  ],
  display: "swap",
});

const body = localFont({
  variable: "--font-body",
  src: [
    { path: "./fonts/outfit-300.woff2", weight: "300", style: "normal" },
    { path: "./fonts/outfit-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/outfit-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/outfit-600.woff2", weight: "600", style: "normal" },
  ],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Wassa Professionals Network — Help a Wassa to Help Wassa",
  description:
    "A non-partisan network of professionals of Wassa descent advancing the development of Wassa and its people.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable}`}>
        {children}
      </body>
    </html>
  );
}
