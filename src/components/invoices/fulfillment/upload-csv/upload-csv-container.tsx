"use client";
import { UploadCsvArea } from "./upload-area";
import FulfullmentContainer from "../container";
import { useDispatch, useSelector } from "@/redux/store";
import { selectOrderSlice } from "@/redux/slices/orderSlice/selectors";
import { toast } from "sonner";
import { orderSlice } from "@/redux/slices/orderSlice/orderSlice";
import { getSession } from "next-auth/react";
import { startTransition } from "react";

export const UploadCsvContainer = ({ carriers, clients }: { carriers: any[], clients: any[] }) => {
  const { uploadedFile } = useSelector(selectOrderSlice);
  const dispatch = useDispatch();

  async function uploadFile(file: File) {
    if (!file) return;
    const allowedTypes = [
      "text/csv",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Unallowed file type. Please upload a CSV or XLSX file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const session = await getSession();
      const token = (session as any)?.userToken;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/orders/import/csv`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        dispatch(orderSlice.actions.setOrdersFromCsv(data));
        toast.success(`${data.orders.length} orders imported`);
      } else {
        toast.error(data.message || "Upload failed");
      }
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    }
  }

  const handleFileChange = (selectedFile: any) => {
    startTransition(() => {
      dispatch(orderSlice.actions.setUploadedFile(selectedFile));
    });
    uploadFile(selectedFile);
  };

  return (
    <div>
      {uploadedFile ? (
        <FulfullmentContainer clients={clients} carriers={carriers} />
      ) : (
        <UploadCsvArea
          handleFileChagne={handleFileChange}
          uploadedFile={uploadedFile}
        />
      )}
    </div>
  );
};
