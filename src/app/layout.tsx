import type { Metadata } from "next";
import { Inter, Fraunces, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "SOFT"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Abhiraj Singh — AI Filmmaker",
    template: "%s · Abhiraj Singh",
  },
  description:
    "Generative cinema, narrative shorts and brand films by Abhiraj Singh — built with AI tools and an old-fashioned obsession with the cut.",
  openGraph: {
    title: "Abhiraj Singh — AI Filmmaker",
    description:
      "Generative cinema, narrative shorts and brand films built with AI tools.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${fraunces.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-foreground selection:text-background">
        <Nav />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
