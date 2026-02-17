"use client";
import { ArrowLeft, Ghost } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export default function NavButtons() {
  const router = useRouter();
  return (
    <button
      className="rounded-full hover:bg-secondary aspect-square p-2 "
      onClick={() => router.back()}
    >
      <ArrowLeft size={18} />
    </button>
  );
}
