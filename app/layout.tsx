import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tatu NF",
  description: "Tatu NF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/headerLogo.svg" />
      </head>
      <body className={inter.className}>
          <main>{children}</main>
      </body>
    </html>
  );
}
