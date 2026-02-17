"use client";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Card } from "../ui/card";
import { ClientCardMenu } from "./menu";

export default function ClientCard({ clientData }: { clientData: any }) {
  if (!clientData) return null;
  const channels = clientData?.channelRefs ?? [];
  return (
    <Card className="border-none p-4 rounded-md">
      <div className="flex items-center gap-2">
        <Link href={`/clients/${clientData.name}/invoices`} className="w-full">
          <span className="text-2xl capitalize  flex justify-between items-center">
            {clientData.name.replace("-", " ")}{" "}
            <ArrowUpRight
              className="hover:bg-foreground hover:text-background rounded-md p-2"
              size={35}
            />
          </span>
        </Link>
        <ClientCardMenu client={clientData} />
      </div>

      <p className="text-sm -mt-1 text-muted-foreground  font-medium">
        {clientData.name}
        <br></br>{clientData.email}
      </p>
      <div className="text-sm mt-2 flex flex-wrap gap-1">
        {channels ? (
          channels.map((channel: any) => (
            <p
              key={channel._id}
              className="flex items-center  p-1 cursor-default hover:brightness-110 rounded-md bg-secondary text-secondary-foreground"
            >
              {channel.type}
            </p>
          ))
        ) : (
          <p>No channels added</p>
        )}
      </div>
    </Card>
  );
}
