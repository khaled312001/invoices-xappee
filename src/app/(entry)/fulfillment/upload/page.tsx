import FulfillmentActionsContainer from "@/components/invoices/fulfillment/actions";
import FulfillmentMetadata from "@/components/invoices/fulfillment/import/metadata";
import FulfillmentUploadMetadata from "@/components/invoices/fulfillment/upload-csv/fulfillment-upload-metadata";
import { UploadCsvContainer } from "@/components/invoices/fulfillment/upload-csv/upload-csv-container";
import { getCurrentSession } from "@/lib/auth";
import { getCarriers } from "@/lib/services/carrier.service";
import { fetchClients } from "@/lib/services/client.service";
import { Suspense } from "react";

export default async function FulfillmentUpload() {
  let carriers = [];
  let clients = [];
  try {
    carriers = await getCarriers();
    clients = await fetchClients();
  } catch (err: any) { }
  const session = await getCurrentSession();
  const user = session?.user || null;
  if (user && user.role !== "admin")
    return (
      <div className="w-full grid place-content-center text-muted-foreground">
        <p className="mt-[40vh]">Forbidden</p>
      </div>
    );

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <main>
        <section className="flex items-start justify-between">
          <h1 className="text-lg">Upload orders csv</h1>
          <FulfillmentActionsContainer clients={clients} isUploadinCsv={true} />
        </section>
        <FulfillmentUploadMetadata />
        <FulfillmentMetadata />
        <br />
        <UploadCsvContainer clients={clients} carriers={carriers} />
      </main>
    </Suspense>
  );
}
