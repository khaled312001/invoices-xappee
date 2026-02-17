"use client";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function ServiceBreakdown({ services }: { services: any }) {
  return (
    <ScrollArea className="h-[22rem]">
      <div className="pt-4">
        {services.map((service, index) => (
          <div
            key={service.service}
            className="flex items-center justify-between"
          >
            <p className="text-left py-2 px-6 font-medium    lowercase w-full">
              {service.service}
            </p>
            <p className="text-left py-2 px-6 ">{service.carrier}</p>

            <p className="text-left py-2 px-6 font-semibold">
              £{service.total.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  );
}
