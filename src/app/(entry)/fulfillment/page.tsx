import FulfillmentActionsContainer from "@/components/invoices/fulfillment/actions";
import FulfullmentContainer from "@/components/invoices/fulfillment/container";
import FulfillmentMetadata from "@/components/invoices/fulfillment/import/metadata";
import OrdersSearch from "@/components/invoices/fulfillment/import/orders/ordersSearch";
import { getCarriers } from "@/lib/services/carrier.service";
import { fetchChannels } from "@/lib/services/channel.service";
import { fetchClients } from "@/lib/services/client.service";

export default async function Home() {
  let channels: any[] = [];
  let carriers = [];
  let clients = [];
  try {
    channels = await fetchChannels();
    carriers = await getCarriers();
    clients = await fetchClients();
  } catch (err: any) {}

  return (
    <main>
      <section className="flex items-start justify-between ">
        <OrdersSearch />
        <FulfillmentActionsContainer
          isUploadinCsv={false}
          clients={clients}
          channels={channels}
        />
      </section>
      <FulfillmentMetadata />
      <br />
      <FulfullmentContainer clients={clients} carriers={carriers} />
    </main>
  );
}
