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


export function AddNewClientFromInvoice({ channels , onNewClient }: { channels: any[],  onNewClient: (newClient: any) => void; }) {
  const [open, setOpen] = useState(false);
  const [client, setClient] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);

  const handleAddClient = async () => {
    try {
      if (loading) return;
      // if (!selectedChannelIds.length) {
      //   toast.error("Please add at least one channel.");
      //   return;
      // }
      
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
      formData.append("image", '');
      const { ok, data } = await Fetch('clients/new', {
        method: 'POST',
        body: formData
      }, undefined, false);

      if (ok) {
        toast.success("client added successfuly");
        const { newClient } = data;
        onNewClient(newClient); // Pass the newly created client data
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


  return (
    <Dialog open={open} onOpenChange={setOpen} modal={false}>
      <DialogTrigger asChild>
      <Button variant='outline' className="ml-2 p-2">
              <Plus className="h-5 w-5 text-red-600" aria-hidden="true" />
            </Button>
      </DialogTrigger>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="w-[80%] flex flex-col justify-center items-start"
      >
        <DialogHeader>
          <DialogTitle>New client</DialogTitle>
          <DialogDescription>
            Add a new client give it a unique name
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
      


          <div className="flex gap-2">
           

            <Input
              value={client.phone}
              onChange={(e) =>
                handleClientDataChange("phone", e.target.value.trim())
              }
              placeholder="Phone"
              className="rounded-md"
            />
          </div>


         
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
