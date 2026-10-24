import "@/styles/globals.css";
import { Fraunces, Space_Grotesk, Space_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/lib/authContext";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["700", "800", "900"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-space-mono",
  weight: ["400", "700"],
  display: "swap",
});

export const metadata = {
  title: "Verity — Brand Governance That Cites Before It Flags",
  description: "Verity reviews content before publication. Every finding names the rule or approved source it breaks, explains why, and suggests a fix that keeps the creator's intent. Humans always make the final call.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${spaceGrotesk.variable} ${spaceMono.variable}`}
    >
      <body className="bg-cream text-ink min-h-screen flex flex-col font-body selection:bg-yellow selection:text-ink">
        <AuthProvider>
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
            {children}
          </main>
          <footer className="border-t-3 border-ink bg-white py-6 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-3">
                <span className="font-heading font-black text-lg">VERITY</span>
                <span className="text-gray-500">|</span>
                <span>Team BraKet — CodeAxis Round 2 ("The Build")</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="bg-mint text-ink font-bold px-2 py-0.5 border border-ink shadow-brutal-sm">
                  AI SUGGESTS. HUMANS DECIDE.
                </span>
                <span className="text-gray-600">Brand errors caught before they are public.</span>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
