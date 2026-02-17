"use client";
import { UploadCsvArea } from "./upload-area";
import FulfullmentContainer from "../container";
import { useDispatch, useSelector } from "@/redux/store";
import { selectOrderSlice } from "@/redux/slices/orderSlice/selectors";
import { toast } from "sonner";
import { UploadFileToServer } from "@/lib/services/files.service";
import { orderSlice } from "@/redux/slices/orderSlice/orderSlice";

export const UploadCsvContainer = ({ carriers, clients }: { carriers: any[], clients:any[] }) => {
  const { uploadedFile } = useSelector(selectOrderSlice);
  const dispatch = useDispatch();
  async function uploadFile(file: File) {
    if (!file) return;
    const allowedTypes = ["text/csv", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Unallowed file type. Please upload a CSV or XLSX file");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);

    try {
      const { ok, data } =  await UploadFileToServer(formData, "orders/import/csv");
      if (ok) {
        dispatch(orderSlice.actions.setOrdersFromCsv(data));
        return `${data.orders.length} orderss been added`;
      } else {
        toast.error(data.message);
      }
    } catch (err: any) {
      toast.error(err.message);
    }

  //   const promise = async () =>
  //     await UploadFileToServer(formData, "orders/import/csv");

  //   toast.promise(promise, {
  //     loading: "Loading...",
  //     success: ({ ok, data }) => {
  //       if (!ok) return;
        // dispatch(orderSlice.actions.setOrdersFromCsv(data));
        // return `${data.orders.length} orderss been added`;
  //     },
  //     error: (error) => {
  //       return toast.error(error.message);
  //     },
  //   });
  }

  const handleFileChange = (selectedFile: any) => {
    dispatch(orderSlice.actions.setUploadedFile(selectedFile));
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
