import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ApolloProvider } from "@/lib/apollo/ApolloProvider";
import { OrganizationProvider } from "@/contexts/OrganizationContext";
import { Navigation } from "@/components/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Project Management System",
  description: "A modern project management system built with Django + GraphQL and React + TypeScript",
  keywords: ["Project Management", "Django", "GraphQL", "React", "TypeScript", "Next.js"],
  authors: [{ name: "Development Team" }],
  openGraph: {
    title: "Project Management System",
    description: "Modern project management system with multi-tenancy support",
    url: "https://localhost:3000",
    siteName: "Project Management",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Project Management System",
    description: "Modern project management system with multi-tenancy support",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ApolloProvider>
          <OrganizationProvider>
            <div className="flex h-screen">
              <Navigation />
              <main className="flex-1 lg:ml-64 overflow-auto">
                {children}
              </main>
            </div>
            <Toaster />
          </OrganizationProvider>
        </ApolloProvider>
      </body>
    </html>
  );
}
