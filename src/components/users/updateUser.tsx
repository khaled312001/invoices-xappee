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
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Fetch } from "@/lib/actions/fetch";
import { revalidateUsers } from "@/lib/actions/revalidateTag";
import { fetchClients } from "@/lib/services/client.service";
import CustomMultipleSelect from "../items/CustomMultipleSelect";
import { DataSelector } from "../shared/dataSelector";
import { Label } from "../ui/label";
import { updateUser } from "@/lib/services/auth.service";

const roles = [
  { name: "admin", label: "Admin" },
  { name: "user", label: "User" },]

export const UpdateUsertButton = ({ user }: { user: any }) => {
  
  const [open, setOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    client: user.client ?? '',
    role: user.role ?? 'user'
  });
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClientId] = useState<string>(user.client ?? '');
  const [selectedRole, setSelectedRole] = useState<string>(user.role ?? 'user');

  useEffect(() => {
    async function getClients() {
      const clientsData = await fetchClients();
      clientsData.push({ name: "No Client", _id: "" });
      if (clientsData) setClients(clientsData);
    }
    getClients();
  }, []);

  useEffect(() => {
    setNewUser((prevUser) => ({
      ...prevUser,
      client: selectedClient == "No Client" ? "" : selectedClient,
      role: selectedRole,
    }));
  }, [selectedClient, selectedRole]);

  const handleSubmitUser = async (e: any) => {
    e.preventDefault();
   
    try {
       const { ok, data } = await updateUser(newUser,user._id);
      if (ok) {
        toast.success("User updated successfully");
        revalidateUsers(); // Uncomment if revalidation is needed
      } else {
        toast.error(data.error.message);
      }
    } catch (err: any) {
      toast.error(`User isn't updated, please try again. | ${err.message}`);
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
          <DialogTitle>Edit User {user.email}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmitUser} className="grid gap-4 py-4">

          {clients.length > 0 ? <>
            <Label>Client</Label>
            <DataSelector
            data={clients}
            itemKey="name"
            returnKey="name"
            selectData={setSelectedClientId}
            selectedData={[selectedClient]}
            text="clients"
            name={"name"}
          />
          </> : null}

          <Label>Role</Label>
          <DataSelector
            data={roles}
            itemKey="name"
            returnKey="name"
            selectData={setSelectedRole}
            selectedData={[selectedRole]}
            text="roles"
            name={"name"}
          /> 


          <Button type="submit">Update</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
