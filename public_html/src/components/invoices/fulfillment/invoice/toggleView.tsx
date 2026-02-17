"use client";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "@/lib/hooks/useSearchParams";
import { SwitchIcon } from "@radix-ui/react-icons";
import { Shuffle } from "lucide-react";
import React from "react";

export default function ToggleView() {
  const { getParam, setParam } = useSearchParams();
  const view = getParam("view") || "service";
  const nextView = view === "order" ? "service" : "order";

  const toggleView = () => {
    setParam("view", nextView);
  };
  return (
    <Button
      onClick={toggleView}
      variant={"ghost"}
      className="gap-2 items-center"
    >
      <Shuffle size={12} strokeWidth={2.5}  />
      <span >by-{view} view</span>
    </Button>
  );
}
