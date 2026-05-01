import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Okami Web Chat",
  description: "Widget de chat para site com integração n8n"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
