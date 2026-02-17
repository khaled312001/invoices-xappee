import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import React from "react";

export default function BreakDownSkele() {
  return (
    <Card className="h-full w-full animate-pulse grid place-content-center  ">
      <Loader2 className="animate-spin"/>
    </Card>
  );
}
