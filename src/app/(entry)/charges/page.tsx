import { getCarriers } from "@/lib/services/carrier.service";
import FulfilmentForm from "./fulfilmentForm";
import { getStorageFees } from "@/lib/services/invoice.service";
import StorageForm from "./storageForm";
import { Separator } from "@/components/ui/separator";
import { getCurrentSession } from "@/lib/auth";

export default async function Charges() {

  const session = await getCurrentSession();
  const user = session?.user || null;
  if (user && user.role !== "admin")
     return (
       <div className="w-full grid place-content-center text-muted-foreground">
         <p className="mt-[40vh]">Forbidden</p>
       </div>
     );
     
     
  let carriers = [];
  let storageFees = [];
  try {
    carriers = await getCarriers();
    storageFees = await getStorageFees();
  } catch (err: any) { }

  return (
    <main>
      <section className="flex-col">
        <StorageForm storageFees={storageFees} />
        <FulfilmentForm carriers={carriers} />
      </section>
    </main>
  );
}
