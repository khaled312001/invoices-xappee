import "../../app/globals.css";
import { Roboto } from "next/font/google";
import { ToggleThemeBtn } from "@/components/shared/toggleThemeBtn";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Logo from "@/components/logo";
import { Suspense } from "react";

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700"],
  subsets: ["latin"],
});

export default function PrintLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={roboto.className + " max-w-5xl mx-auto p-8 "}>
      <header className="flex justify-between items-center mb-8">
        <Suspense
          fallback={
            <Image
              src="/logo.png"
              alt=" "
              width={150}
              height={50}
              className="object-contain"
            />
          }
        >
          <Logo />
        </Suspense>
        <div className="flex items-center gap-4">
          <Link href="/clients">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft strokeWidth={2.5} size={17} /> Back to clients
            </Button>
          </Link>
          <ToggleThemeBtn />
        </div>
      </header>

      {children}
    </div>
  );
}
