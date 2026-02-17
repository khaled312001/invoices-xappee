"use client";

import { Input } from "@/components/ui/input";
import { orderSlice } from "@/redux/slices/orderSlice/orderSlice";
import { useDispatch } from "@/redux/store";
import { FileUp } from "lucide-react";
import { useState } from "react";

export const UploadCsvArea = ({
  uploadedFile,
  handleFileChagne,
}: {
  uploadedFile: File | null;
  handleFileChagne: any;
}) => {
  const [isDroppingFile, setIsDroppingFile] = useState(false);
  const dispatch = useDispatch();

  return (
    <div className="grid w-full h-max place-content-center">
      <div className="relative group">
        <Input
          name="file"
          onChange={(e) => {
            handleFileChagne(e.target.files[0]);
          }}
          onDragEnter={() => setIsDroppingFile(true)}
          onDragLeave={() => setIsDroppingFile(false)}
          type="file"
          className="w-[95vw] h-[75vh] z-10 opacity-0 cursor-pointer  rounded-xl absolute  "
        />
        <div
          className={`p-6 w-[95vw] h-[75vh]  aspect-video rounded-xl flex flex-col gap-2 items-center justify-center ${
            isDroppingFile
              ? "bg-secondary/10 border-2   border-dashed text-secondary-foreground/50"
              : " text-muted-foreground/50"
          }`}
        >
          <FileUp size={70} strokeWidth={0.5} className="" />
          <p className="text-base ">
            {uploadedFile
              ? uploadedFile.name
              : "Click or Drag and Drop file here."}{" "}
          </p>
        </div>
      </div>
    </div>
  );
};
