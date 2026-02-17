import { AddNewClient } from "@/components/clients/addNewClient";
import ClientCard from "@/components/clients/client";
import { fetchChannels } from "@/lib/services/channel.service";
import { fetchClients } from "@/lib/services/client.service";

export default async function Clients() {
  const clientsData = await fetchClients();
  const channels = await fetchChannels();

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center justify-between">
        <h1 className="text-lg">
          Clients
          <span className=" text-muted-foreground">
            {" "}
            {` (${clientsData.length})`}
          </span>
        </h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <AddNewClient channels={channels} />
        {clientsData?.map((client: any, i: number) => (
          <ClientCard key={i} clientData={client} />
        ))}
      </div>
    </div>
  );
}
