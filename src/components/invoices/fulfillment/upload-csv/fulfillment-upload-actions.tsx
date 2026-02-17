"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useDispatch, useSelector } from "@/redux/store";
import { selectOrderSlice } from "@/redux/slices/orderSlice/selectors";
import { orderSlice } from "@/redux/slices/orderSlice/orderSlice";

export default function UploadActions() {
  const { uploadedFile } = useSelector(selectOrderSlice);
  const dispatch = useDispatch();

  return (
    <div className="flex items-center gap-2">
      {uploadedFile && (
        <Button
          onClick={() =>
            dispatch(orderSlice.actions.discardFile())
          }
          className="gap-2"
        >
          Discard {uploadedFile.name} <Trash size={17} strokeWidth={2.5} />
        </Button>
      )}
    </div>
  );
}
