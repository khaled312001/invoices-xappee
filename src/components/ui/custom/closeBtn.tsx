import { X } from "lucide-react";
import React from "react";
import { Button } from "../button";

export default function CloseBtn() {
  return (
    <Button size={"icon"} className=" rounded-full  w-5 h-5" variant={"ghost"} >
      <X size={15} />
    </Button>
  );
}
