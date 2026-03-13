import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Post Pilot | The Simplest Way to Post on LinkedIn",
    template: "%s | Post Pilot",
  },
  description:
    "A minimal tool that authenticates with LinkedIn and lets you publish posts instantly. Secure OAuth login, instant publishing, and a clean writing interface.",
  keywords: [
    "LinkedIn",
    "LinkedIn post",
    "social media",
    "content publishing",
    "LinkedIn OAuth",
    "post scheduler",
    "LinkedIn tool",
  ],
  authors: [
    {
      name: "Dev Sethi",
      url: "https://devsethi.site",
    },
  ],
  creator: "Dev Sethi",
  publisher: "Dev Sethi",
  metadataBase: new URL("https://postpilot.devsethi.site"),
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Post Pilot - The Simplest Way to Post on LinkedIn",
    description:
      "A minimal tool that authenticates with LinkedIn and lets you publish posts instantly.",
    siteName: "Post Pilot",
  },
  twitter: {
    card: "summary_large_image",
    title: "Post Pilot | The Simplest Way to Post on LinkedIn",
    description:
      "A minimal tool that authenticates with LinkedIn and lets you publish posts instantly.",
    creator: "@imsethidev",
  },
  robots: {
    index: true,
    follow: true,
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
      className={cn("font-sans", inter.variable)}
      suppressHydrationWarning
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster />
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
