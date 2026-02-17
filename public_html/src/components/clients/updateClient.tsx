"use client";
import { Edit2, Trash2 } from "lucide-react";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChangeEvent, useRef, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { updateNewClient } from "@/lib/services/client.service";
import { revalidateClients } from "@/lib/actions/revalidateTag";
import { Fetch } from "@/lib/actions/fetch";
import { Label } from "../ui/label";

export const UpdateClientButton = ({ client }: { client: any }) => {
  const [open, setOpen] = useState(false);
  const [newClient, setNewClient] = useState({
    name: client.name,
    busineesName: client.busineesName,
    email: client.email,
    address: client.address,
    taxNo: client.taxNo,
    accName: client.accName,
    accNumber: client.accNumber,
    sortCode: client.sortCode,
    phone: client.phone,
    website: client.website,
    notes: client.notes
  });

  const [imageFile, setImageFile] = useState<File | null>(null); // State for new image file
  const imageUrl = client.imageUrl ? `${process.env.NEXT_PUBLIC_SERVER}${client.imageUrl}` : null;
  const [imagePreview, setImagePreview] = useState<string | null>(imageUrl); // State for image preview
  const fileInputRef = useRef<HTMLInputElement | null>(null); // Create a ref for the file input

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewClient({ ...newClient, [e.target.name]: e.target.value });
  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null; // Update file state
    setImageFile(selectedFile);

    if (selectedFile) {
      const fileURL = URL.createObjectURL(selectedFile); // Create a URL for the selected file
      setImagePreview(fileURL); // Set the image preview URL
    } else {
      setImagePreview(null); // Reset the preview if no file is selected
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null); // Clear the file
    setImagePreview(null); // Clear the image preview
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the file input value
    }
  };

  const handleSubmitClient = async (e: any) => {
    e.preventDefault();
    if (!newClient.email) {
      toast.error("Email is required.");
      return;
    }
    const formData = new FormData(); // Create a FormData object
    formData.append('name', newClient.name);
    formData.append('busineesName', newClient.busineesName);
    formData.append('email', newClient.email);
    formData.append('address', newClient.address);
    formData.append('taxNo', newClient.taxNo);
    formData.append('accName', newClient.accName);
    formData.append('accNumber', newClient.accNumber);
    formData.append('sortCode', newClient.sortCode);
    formData.append('phone', newClient.phone);
    formData.append('website', newClient.website);
    formData.append('notes', newClient.notes);

    // Append the image file if it exists
    if (imageFile) {
      formData.append('image', imageFile); // Assuming the backend expects 'image' as the key
    }

    try {
      // const { ok, data } = await updateNewClient(formData);
      const { ok, data } = await Fetch('clients/update', {
        method: 'PUT',
        body: formData
      }, undefined, false);
      if (ok) {
        toast.success("Client updated successfully");
        revalidateClients(); // Uncomment if revalidation is needed
      } else {
        toast.error(data.error.message);
      }
    } catch (err: any) {
      toast.error(`Client isn't updated, please try again. | ${err.message}`);
    } finally {
      setOpen(false); // Close the dialog after the operation
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="w-full">
          <DropdownMenuItem className="justify-between" onClick={() => setOpen(true)}>
            Edit <Edit2 size={17} />
          </DropdownMenuItem>
        </button>
      </DialogTrigger>
      <DialogContent className="w-[700px]">
        <DialogHeader>
          <DialogTitle>Edit Client {client.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmitClient} className="grid gap-4 py-4">
          {/* Display the existing image if there is one */}

          <Input
            onChange={handleInputChange}
            label="busineesName"
            name="busineesName"
            placeholder="Businees Name"
            value={newClient.busineesName}
          />

          <Input
            onChange={handleInputChange}
            label="email"
            name="email"
            placeholder="Email"
            value={newClient.email}
          />
          <Input
            onChange={handleInputChange}
            label="address"
            name="address"
            placeholder="Address"
            value={newClient.address}
          />
          <div className="flex gap-2">
            <Input
              onChange={handleInputChange}
              placeholder="Tax Number"
              label="Tax Number"
              name="taxNo"
              value={newClient.taxNo}
            />

            <Input
              value={newClient.phone}
              onChange={handleInputChange}
              placeholder="Phone"
              label="Phone"
              name="phone"
            />
          </div>


          <div className="flex flex-col">
            <Label className="mb-2 font-medium">Payment Details</Label>
            <div className="flex gap-2">
              <Input
                value={newClient.accName}
                onChange={handleInputChange}
                placeholder="Account Name"
                label="Payment Account Name"
                name="accName"
              />

              <Input
                value={newClient.accNumber}
                onChange={handleInputChange}
                placeholder="Account Number"
                label="Account Number"
                name="accNumber"
              />
              <Input
                value={newClient.sortCode}
                onChange={handleInputChange}
                placeholder="Sort Code"
                label="Sort Code"
                name="sortCode"
              />
            </div>
          </div>
          <Input
            value={newClient.website}
            onChange={handleInputChange}
            placeholder="Website"
            label="Website"
            name="website"
          />
          <textarea
            className="bg-white w-full rounded-lg shadow border p-2 text-sm"
            // rows="5"
            placeholder="Invoice Notes"
            onChange={handleInputChange}
            name="notes"
            id="notes"
            value={newClient.notes}
          ></textarea>


          {/* File input for uploading a new image */}
          <Input
            ref={fileInputRef} // Attach the ref to the input
            type="file"
            onChange={handleFileChange}
            accept="image/*" // Accept only image files
            label="Upload New Image"
            name="image"
          />


          {imagePreview && (
            <div className="mt-4 flex items-center justify-center"> {/* Added justify-center here */}
              <img src={imagePreview} alt="Selected Preview" className="rounded-md h-56 w-auto" />
              {imageFile && (
                <button
                  onClick={handleRemoveImage}
                  className="flex items-center justify-center p-2 hover:bg-gray-200 rounded-md">
                  <Trash2 size={20} color="red" /> {/* Trash icon */}
                </button>
              )}
            </div>
          )}


          <Button type="submit">Update</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
