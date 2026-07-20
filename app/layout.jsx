import "./globals.css";

export const metadata = {
  title: "Maria Maria — Il piacere del vino",
  description: "Italienische Boutique-Weine für bewusst gewählte Genussmomente.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Montserrat:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-montserrat">{children}</body>
    </html>
  );
}
