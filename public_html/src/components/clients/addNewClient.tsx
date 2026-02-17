"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useState, useRef } from "react";
import { postNewClient } from "@/lib/services/client.service";
import { toast } from "sonner";
import { revalidateClients } from "@/lib/actions/revalidateTag";
import { Card } from "../ui/card";
import { DataSelector } from "../shared/dataSelector";
import { Fetch } from "@/lib/actions/fetch";
import { Label } from "../ui/label";


export function AddNewClient({ channels }: { channels: any[] }) {
  const [open, setOpen] = useState(false);
  const [selectedChannelIds, setSelectedChannelIds] = useState<number[]>([]);
  const [client, setClient] = useState({
    name: "",
    busineesName: "",
    email: "",
    address: "",
    taxNo: "",
    accName: "",
    accNumber: "",
    sortCode: "",
    phone: "",
    website: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null); // State for image file
  const fileInputRef = useRef<HTMLInputElement | null>(null); // Create a ref for the file input
  const [imagePreview, setImagePreview] = useState<string | null>(null); // State for image preview

  const handleAddClient = async () => {
    try {
      if (loading) return;
      if (!selectedChannelIds.length) {
        toast.error("Please add at least one channel.");
        return;
      }

      if (!client.email) {
        toast.error("Email is required.");
        return;
      }
      
      setLoading(true);
      // const { ok, data } = await postNewClient({
      //   ...client,
      //   channel_ids: selectedChannelIds,
      // });
      // Create form data to include the image file
      const formData = new FormData();
      Object.keys(client).forEach((key) => {
        formData.append(key, client[key as keyof typeof client]);
      });
      formData.append("channel_ids", JSON.stringify(selectedChannelIds));
      console.log("JSON.stringify(selectedChannelIds)", JSON.stringify(selectedChannelIds))
      if (file) formData.append("image", file); // Append the image file

      const { ok, data } = await Fetch('clients/new', {
        method: 'POST',
        body: formData
      }, undefined, false);

      if (ok) {
        toast.success("client added successfuly");
        setFile(null);
        revalidateClients();
      } else {
        toast.error(data.error.message);
      }
    } catch (err: any) {
      toast.error("failed to add client, please try again later.");
    } finally {
      setOpen(false);
      setLoading(false);
    }
  };

  const handleClientDataChange = (key: string, value: any) => [
    setClient({ ...client, [key]: value }),
  ];



  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null; // Update file state
    setFile(selectedFile);

    if (selectedFile) {
      const fileURL = URL.createObjectURL(selectedFile); // Create a URL for the selected file
      setImagePreview(fileURL); // Set the image preview URL
    } else {
      setImagePreview(null); // Reset the preview if no file is selected
    }
  };

  const handleRemoveImage = () => {
    setFile(null); // Clear the file
    setImagePreview(null); // Clear the image preview
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the file input value
    }
  };


  return (
    <Dialog open={open} onOpenChange={setOpen} modal={false}>
      <DialogTrigger asChild>
        <button className="gap-2 h-full ">
          <Card className="border-none p-4 h-full flex flex-col justify-center items-center gap-2 hover:brightness-125">
            <Plus size={24} strokeWidth={3} />
            <p>Add New</p>
          </Card>
        </button>
      </DialogTrigger>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="w-[80%] flex flex-col justify-center items-center"
      >
        <DialogHeader>
          <DialogTitle>New client</DialogTitle>
          <DialogDescription>
            Add a new client give it a unique name & connect it to e-commerce
            channels.
          </DialogDescription>
        </DialogHeader>
        <div className="w-full space-y-4 mt-5 ">
          <Input
            value={client.name}
            required
            onChange={(e) =>
              handleClientDataChange("name", e.target.value.trim())
            }
            placeholder="Name"
            className="rounded-md"
          />
           <Input
            value={client.busineesName}
            required
            onChange={(e) =>
              handleClientDataChange("busineesName", e.target.value.trim())
            }
            placeholder="Business name"
            className="rounded-md"
          />
          <Input
            value={client.email}
            onChange={(e) =>
              handleClientDataChange(
                "email",
                e.target.value.trim().toLowerCase()
              )
            }
            required
            placeholder="client@business.com"
            className="rounded-md"
          />
          <Input
            value={client.address}
            onChange={(e) =>
              handleClientDataChange(
                "address",
                e.target.value.trim().toLowerCase()
              )
            }
            placeholder="123 Main St, Apt 4B, New York, NY 10001"
            className="rounded-md"
          />
          <DataSelector
            data={channels}
            itemKey="channel_id"
            returnKey="channel_id"
            selectData={setSelectedChannelIds}
            selectedData={selectedChannelIds}
            text="channels"
            extra={"type"}
            mutliple={true}
            name={"name"}
          />


          <div className="flex gap-2">
            <Input
              value={client.taxNo}
              onChange={(e) =>
                handleClientDataChange("taxNo", e.target.value.trim())
              }
              placeholder="Tax Number"
              className="rounded-md"
            />

            <Input
              value={client.phone}
              onChange={(e) =>
                handleClientDataChange("phone", e.target.value.trim())
              }
              placeholder="Phone"
              className="rounded-md"
            />
          </div>

          <div className="flex flex-col">
            <Label className="mb-2 font-medium">Payment Details</Label>
            <div className="flex gap-2">
              <Input
                value={client.accName}
                onChange={(e) =>
                  handleClientDataChange("accName", e.target.value.trim())
                }
                placeholder="Account Name"
                className="rounded-md"
              />

              <Input
                value={client.accNumber}
                onChange={(e) =>
                  handleClientDataChange("accNumber", e.target.value.trim())
                }
                placeholder="Account Number"
                className="rounded-md"
              />
              <Input
                value={client.sortCode}
                onChange={(e) =>
                  handleClientDataChange("sortCode", e.target.value.trim())
                }
                placeholder="Sort Code"
                className="rounded-md"
              />
            </div>
          </div>

          <Input
            value={client.website}
            onChange={(e) =>
              handleClientDataChange("website", e.target.value.trim())
            }
            placeholder="Website"
            className="rounded-md"
          />
          <textarea
            className="bg-white w-full rounded-lg shadow border p-2"
            // rows="5"
            placeholder="Invoice Notes"
            onChange={(e) =>
              handleClientDataChange("notes", e.target.value.trim())
            }
            name="notes"
            id="notes"
            value={client.notes}
          ></textarea>

          <Input
            ref={fileInputRef} // Attach the ref to the input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            placeholder="Upload client logo"
          />

          {/* Display image preview and trash icon */}
          {imagePreview && (
            <div className="mt-4 flex items-center justify-center">
              <img src={imagePreview} alt="Selected Preview" className="rounded-md h-56 w-auto" />
              <button onClick={handleRemoveImage} className="flex items-center justify-center p-2 hover:bg-gray-200 rounded-md">
                <Trash2 size={20} color="red" /> {/* Trash icon */}
              </button>
            </div>
          )}
        </div>
        <DialogFooter className="w-full">
          <Button
            onClick={handleAddClient}
            type="submit"
            className="w-full rounded-md"
            disabled={loading}
          >
            {loading && <Loader2 className="animate-spin" size={20} />} Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
