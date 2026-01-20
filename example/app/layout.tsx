import "./globals.css";
import type { Metadata } from "next";
import { getServerTranslation } from "@/src/localization/useServerTranslation";

export async function generateMetadata(): Promise<Metadata> {
  const { translate } = await getServerTranslation();

  return {
    title: translate("metaTitle"),
    description: translate("metaDescription"),
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
