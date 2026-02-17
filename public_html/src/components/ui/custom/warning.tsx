import { AlertTriangle } from "lucide-react";
import React, { useEffect, useRef } from "react";

export default function Warning({
}: {
}) {
  return (
    <AlertTriangle size={15} className="text-yellow-500 relative -top-[1px]" />
  );
}
