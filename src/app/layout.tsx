import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import QueryProvider from "@/providers/QueryProvider";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import GlobalParticles from "@/components/GlobalParticles";
import NavBar from "@/components/NavBar";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plusjakarta",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Marcela Cordero - Makeup Artist | Maquillaje Profesional",
    template: "%s | Marcela Cordero - Makeup Artist",
  },
  description:
    "Servicios profesionales de maquillaje para bodas, eventos sociales y sesiones fotográficas. Reserva tu cita con Marcela Cordero, maquilladora certificada con más de 5 años de experiencia. Disponible en toda la región.",
  keywords: [
    "maquillaje profesional",
    "makeup artist",
    "maquillaje de bodas",
    "maquillaje para eventos",
    "sesiones fotográficas",
    "Marcela Cordero",
    "maquilladora certificada",
    "reservar cita maquillaje",
    "servicios de belleza",
    "maquillaje nupcial",
  ],
  authors: [{ name: "Marcela Cordero", url: "https://marcelacordero.com" }],
  creator: "Marcela Cordero",
  publisher: "Marcela Cordero Makeup Studio",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://marcelacordero.com",
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://marcelacordero.com",
    siteName: "Marcela Cordero - Makeup Artist",
    title: "Marcela Cordero - Makeup Artist | Maquillaje Profesional",
    description:
      "Servicios profesionales de maquillaje para bodas, eventos sociales y sesiones fotográficas. Reserva tu cita con Marcela Cordero, maquilladora certificada.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Marcela Cordero - Makeup Artist",
        type: "image/jpeg",
      },
      {
        url: "/images/og-image-square.jpg",
        width: 400,
        height: 400,
        alt: "Marcela Cordero - Makeup Artist Logo",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@marcelacordero_mua",
    creator: "@marcelacordero_mua",
    title: "Marcela Cordero - Makeup Artist | Maquillaje Profesional",
    description:
      "Servicios profesionales de maquillaje para bodas, eventos y sesiones fotográficas. Reserva tu cita con Marcela Cordero.",
    images: ["/images/twitter-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#D4AF37",
      },
      {
        rel: "icon",
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        rel: "icon",
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
  manifest: "/site.webmanifest",
  category: "Beauty & Personal Care",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://marcelacordero.com/#business",
    name: "Marcela Cordero - Makeup Artist",
    description:
      "Servicios profesionales de maquillaje para bodas, eventos sociales y sesiones fotográficas.",
    url: "https://marcelacordero.com",
    telephone: "+51-989-164-990",
    email: "info@marcelacordero.com",
    image: "https://marcelacordero.com/images/og-image.jpg",
    logo: "https://marcelacordero.com/images/logo.png",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Av. Principal 123",
      addressLocality: "Ciudad",
      addressRegion: "Estado",
      postalCode: "12345",
      addressCountry: "MX",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "19.4326",
      longitude: "-99.1332",
    },
    areaServed: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: "19.4326",
        longitude: "-99.1332",
      },
      geoRadius: 50000,
    },
    serviceType: [
      "Maquillaje de bodas",
      "Maquillaje para eventos",
      "Sesiones fotográficas",
      "Maquillaje profesional",
    ],
    priceRange: "$$$",
    openingHours: ["Mo-Fr 09:00-18:00", "Sa 09:00-16:00"],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "127",
    },
    founder: {
      "@type": "Person",
      name: "Marcela Cordero",
      jobTitle: "Professional Makeup Artist",
      url: "https://marcelacordero.com/about",
    },
    sameAs: [
      "https://www.instagram.com/marcelacorderobeauty/",
      "https://www.facebook.com/marcelacorderomakeup",
      "https://www.tiktok.com/@marcelacordero_mua",
  "https://wa.me/51989164990",
    ],
  };

  return (
    <html lang="es">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <meta name="theme-color" content="#1C1C1C" />
        <meta name="msapplication-TileColor" content="#D4AF37" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <link rel="canonical" href="https://marcelacordero.com" />
      </head>
      <body
        className={`${plusJakarta.variable} antialiased overflow-x-hidden max-w-full`}
      >
        <GlobalParticles />
        <NavBar />
        <QueryProvider>{children}</QueryProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 6000,
            style: {
              background: "var(--color-surface)",
              color: "var(--color-heading)",
              border: "1px solid var(--color-accent-primary)",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: "500",
              maxWidth: "400px",
              boxShadow:
                "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            },
            success: {
              iconTheme: {
                primary: "var(--color-accent-primary)",
                secondary: "var(--color-surface)",
              },
            },
            error: {
              iconTheme: {
                primary: "#EF4444",
                secondary: "var(--color-surface)",
              },
            },
          }}
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
