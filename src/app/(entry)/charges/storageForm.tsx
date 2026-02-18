
"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { postStorageCharges } from "@/lib/services/invoice.service";
import { useState } from "react";
import { toast } from "sonner";


const StorageForm = ({ storageFees }) => {

    const [cbm, setCbm] = useState(storageFees?.cbm || 0);
    const [space, setSpace] = useState(storageFees?.space || 0);

    const handleStorageSubmit = async (e) => {
        e.preventDefault();
        // Handle form submission to update the charges in the backend
        try {
            await postStorageCharges({ "cbm": cbm, "space": space });

            toast.success(`Storage charges updated successfuly`);

        } catch (error) {
            console.error('Error updating charges:', error);
            toast.error(`Can't update charges. | ${error.message}`);
        }
    };

    return (
        <div>

            <form onSubmit={handleStorageSubmit}>
                <section className="flex  items-start mb-5">
                    <h1 className="text-lg mr-20">Edit Storage Charges</h1>
                    <Button type="submit">Update</Button>
                </section>

                <div>
                    <label htmlFor="cbm">CBM:</label>
                    <Input
                        type="number"
                        id="cbm"
                        name="cbm"
                        value={cbm}
                        onChange={(e) => setCbm(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="space">Space:</label>
                    <Input
                        type="number"
                        id="space"
                        name="space"
                        value={space}
                        onChange={(e) => setSpace(e.target.value)}
                    />
                </div>

            </form>

        </div>
    );
};

export default StorageForm;
