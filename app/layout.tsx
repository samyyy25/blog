import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "~/logbook",
  description: "A personal, multi-author tech blog.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          {children}
          <footer className="footer">
            <span>built one quiet evening at a time</span>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
