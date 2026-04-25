import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeContext";

export const metadata: Metadata = {
  title: "Gym Tracker Dashboard",
  description: "Dashboard para visualizar progreso de entrenamientos del gym",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
