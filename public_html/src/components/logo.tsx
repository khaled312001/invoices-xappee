"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import logoImage from "../../public/logo.png"
export default function Logo({ className }: { className?: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogoClick = () => {
    const params = new URLSearchParams(searchParams);

    const query = params.toString();

    router.push(`/${query ? `?${query}` : ""}`);
  };

  return (
    <button onClick={handleLogoClick} className={cn("", className)}>
      <Image
        src={logoImage}
        alt="Xappee"
        width={150}
        height={50}
        className="object-contain"
      />
    </button>
  );
}
