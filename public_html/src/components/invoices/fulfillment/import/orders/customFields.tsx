import React from "react";
import Image from "next/image";
import Warning from "@/components/ui/custom/warning";

export function ShippedStatus({ status }: { status: string }) {
  return (
    <p
      className={` w-fit text-xs mt-2  p-1 font-medium  rounded-md flex items-center text-center ${
        (status.toLocaleLowerCase() === "shipped") ? "bg-green-500/40" : "bg-red-500/20"
      }`}
    >
      {status}
    </p>
  );
}

export function ChannelLogo({ channel }: { channel: string }) {
  return (
    <Image
      src={`/${channel}.png`}
      alt={`${channel} logo`}
      width={400}
      height={200}
      className={` ${
        channel === "amazon" && "dark:invert"
      } w-14 aspect-video object-contain`}
    />
  );
}

export function ServiceTitle({ service }: { service: string | undefined }) {
  if (!service)
    return (
      <p className="flex items-center gap-2">
        null <Warning />
      </p>
    );

  const extractedService = service.includes("|")
    ? service.split("|")[1]
    : service;
  return <p>{extractedService}</p>;
}
