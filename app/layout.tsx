import type { Metadata } from "next";
import localFont from "next/font/local";

import "./globals.css";

import { ThemeProvider } from './context/ThemeContext';

const dtmSans = localFont({
  src: '/DTM-Sans.otf',
  variable: '--font-dtm-sans',
});

const ubuntuRegular = localFont({
  src: '/Ubuntu-Regular.ttf',
  variable: '--font-ubuntu-regular',
});

export const metadata: Metadata = {
  title: "Flonne Reverie's Portfolio • Web Developer, Full-Stack",
  description: "Hello! My name is Flonne Reverie. I'm a Senior Web Developer with 8+ years of full-stack experience, seeking work in Portugal!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
        <body className={`${dtmSans.variable} ${ubuntuRegular.variable}`}>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </body>
      </html>
  );
}
