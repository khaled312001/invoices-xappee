import { ReactNode, Suspense } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/themeProvider";
import SessionProvider from "@/contexts/sessionProvider";
import { ReduxProvider } from "@/contexts/reduxProvider";
import { Toaster } from "sonner";
import { getCurrentSession } from "@/lib/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Xappee",
  description: "Xappee warehouse management and invoices system.",
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getCurrentSession();
  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className={inter.className}>
        <ThemeProvider>
          <SessionProvider session={session}>
            <ReduxProvider>
              <Toaster richColors />
              <Suspense>{children}</Suspense>
            </ReduxProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
