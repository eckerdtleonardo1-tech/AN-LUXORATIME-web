import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { CartProvider } from "@/components/CartProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://anluxoratime.vercel.app'),
  title: "AN LUXORATIME | Relojes G-Shock",
  description: "Especialistas en relojes Casio G-Shock. Catálogo y venta directa.",
  icons: {
    icon: '/logo-cropped.png',
    apple: '/logo-cropped.png',
  },
  openGraph: {
    title: "AN LUXORATIME | Relojes G-Shock",
    description: "Especialistas en relojes Casio G-Shock. Catálogo y venta directa.",
    url: "https://anluxoratime.com",
    siteName: "AN LUXORATIME",
    images: [
      {
        url: "/logo-cropped.png",
        width: 800,
        height: 800,
      },
    ],
    locale: "es_AR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <Header />
            <main>
              {children}
            </main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
