import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "McCall Prevention Services - Mental Health Training Programs",
  description: "Register for Mental Health First Aid (MHFA) and QPR suicide prevention trainings offered by McCall Behavioral Health Network.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}