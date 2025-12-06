import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: "CS Society - Everyone Belongs Here",
  description: "From Curious Coders to Late-Night Debuggers - Welcome to your digital clubhouse",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="w-full">
      <body className="antialiased w-full min-h-screen flex flex-col" style={{ backgroundColor: '#0a1628' }}>
        <AuthProvider>
          <Navigation />
          <main className="flex-grow w-full">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
