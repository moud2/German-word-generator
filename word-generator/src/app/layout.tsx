import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "German Word Generator",
  description: "Learn a new German word every time you hit Generate!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* ✅ Google Site Verification */}
        <meta
          name="google-site-verification"
          content="ylOUFExag692M4GW1X_8Wodc56OsBw41idNCcjxf_h4"
        />

        {/* ✅ Plausible Analytics with tagged events */}
        <script
          defer
          data-domain="qamar.onrender.com"
          src="https://plausible.io/js/script.outbound-links.tagged-events.js"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.plausible = window.plausible || function() {
                (window.plausible.q = window.plausible.q || []).push(arguments);
              };
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider> {/* ✅ wrap your app */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
