import { DataSelector } from "@/components/shared/dataSelector";

export default function SelectClient({
  clients,
  selectedClient,
  setSelectedClient,
  
}: {
  clients: any[];
  selectedClient: any;
  setSelectedClient: any;
}) {
  return (
    <DataSelector
      text="Clients"
      data={clients}
      itemKey="name"
      selectData={setSelectedClient}
      selectedData={[selectedClient]}
    />
  );
}
