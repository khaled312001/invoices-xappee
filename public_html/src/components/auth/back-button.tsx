"use client";
import React from "react";
import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export function BackButton({ href }: { href?: string }) {
  const router = useRouter();
  return (
    <Button
      onClick={() => {
        href ? router.push(href) : router.back();
      }}
      variant={"ghost"}
      size={"icon"}
      className="text-muted-foreground"
    >
      <ChevronLeft size={18} strokeWidth={2.5} />
    </Button>
  );
}

export function ForwardButton({ href }: { href?: string }) {
  const router = useRouter();
  return (
    <Button
      onClick={() => {
        href ? router.push(href) : router.forward();
      }}
      variant={"ghost"}
      size={"icon"}
      className="text-muted-foreground"
    >
      <ChevronRight size={18} strokeWidth={2.5} />
    </Button>
  );
}
