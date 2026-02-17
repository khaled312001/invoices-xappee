"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import { UploadCsvArea } from "@/components/invoices/fulfillment/upload-csv/upload-area";
import { fetchClients } from "@/lib/services/client.service";
import { UploadFileToServer } from "@/lib/services/files.service";
import { itemslice } from "@/redux/slices/itemSlice/itemSlice";
import { selectItemsSlice } from "@/redux/slices/itemSlice/selectors";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

export default function UploadItems() {
  const { uploadedFile } = useSelector(selectItemsSlice);
  const [clients, setClients] = useState([]);

  const [selectedClient, setSelectedClient] = useState(null);
  const dispatch = useDispatch();
  const session =  useSession();
  const user: any = session?.data.user || null;
  useEffect(() => {
    async function getClients() {
      const clientsData = await fetchClients();
      if (clientsData) setClients(clientsData);
    }
    getClients();
 
    // async function getSession() {
    //   const session =  useSession();
    //   // const user = session?.user || null;
    //   // setUser(user);
    //   console.log("usssssser", session);
    // }
    // getSession();

  }, []);

  const handleFileChange = (selectedFile: any) => {
    dispatch(itemslice.actions.setUploadedFile(selectedFile));
  };

  const uploadFile = async () => {
    if (!selectedClient) {
      toast.error("Please select a client first");
      return;
    }

    if (!uploadedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    const allowedTypes = ["text/csv", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];

    if (!allowedTypes.includes(uploadedFile.type)) {
      toast.error("Unallowed file type. Please upload a CSV or XLSX file");
      return;
    }

    const formData = new FormData();
    formData.append("file", uploadedFile);
    formData.append("clientId", selectedClient);

    try {
      const { ok, data } = await UploadFileToServer(formData, `items/import/csv/${selectedClient}`);
      if (ok) {
        dispatch(itemslice.actions.setItemsFromCsv(data.items));
        toast.success(`${data.items.length} items have been added`);
      } else {
        toast.error(data.message);
      }
    } catch (err: any) {
      toast.error(err.message);
    }
    //   const promise = async () =>
    //     await UploadFileToServer(formData, `items/import/csv/${selectedClient}`);

    //   toast.promise(promise, {
    //     loading: "Loading...",
    //     success: ({ ok, data }) => {
    //       if (!ok) return;
    //       dispatch(itemslice.actions.setItemsFromCsv(data.items));
    //       return `${data.items.length} items have been added`;
    //     },
    //     error: (error) => {
    //       return toast.error(error.message);
    //     },
    //   });
  };

  if (user && user.role !== "admin")
     return (
       <div className="w-full grid place-content-center text-muted-foreground">
         <p className="mt-[40vh]">Forbidden</p>
       </div>
     );

  return (
    <main>
      <section className="flex items-start justify-between">
        <h1 className="text-lg">Upload items csv</h1>
        <div className="flex gap-2">
          <Select
            value={selectedClient}
            onValueChange={(v) =>
              setSelectedClient((prev) => (prev === v ? null : v))
            }
          >
            <SelectTrigger className="rounded">
              {selectedClient ? selectedClient : "Select a client"}
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {clients.map((client) => (
                  <SelectItem key={client.name} value={client.name}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button
            onClick={uploadFile}
            className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Upload File
          </Button>
        </div>
      </section>
      <UploadCsvArea
        handleFileChagne={handleFileChange}
        uploadedFile={uploadedFile}
      />
    </main>
  );
}
