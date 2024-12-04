import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import React from "react";

const Roboto = localFont({
  src: './fonts/Roboto-Regular.woff', variable: '--font-roboto', weight: '400',
});


export const metadata: Metadata = {
  title: "Docker App | by Raul Bolivar",
  description: "Docker App Manager",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
          className={`${Roboto.variable} ${Roboto.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
