"use client";

import { PolarGrid, RadialBar, RadialBarChart, Tooltip } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

// Define the structure of a service
interface Service {
  carrier: string;
  name: string;
  total: string;
}

// Custom tooltip component
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background p-2 border rounded shadow-sm">
        <p>{`${payload[0].payload.name}`}</p>
        <p>{`Total: £${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

export function RadialChart({ services }: { services: Service[] }) {
  // Transform services data for the chart
  const chartData = services.map((service) => ({
    name: `${service.name} (${service.carrier})`,
    total: service.total,
    fill: `hsl(${Math.random() * 360}, 70%, 50%)`, // Generate a random color
  }));

  // Generate chart config dynamically
  const chartConfig: ChartConfig = {
    total: {
      label: "Total",
    },
    ...Object.fromEntries(
      services.map((service, i) => [
        service.name,
        {
          label: `${service.name}`,
          color: `hsl(${i * 50}, 65%, 50%)`, // Generate a random color
        },
      ])
    ),
  };

  return (
    <Card className="flex flex-col h-[31rem] border-none relative">
      <CardHeader className="items-center pb-0">
        <CardTitle>Services Overview</CardTitle>
        <CardDescription>Total by Service and Carrier</CardDescription>
      </CardHeader>
      <CardContent className="flex-1  ">
        <ChartContainer
          config={chartConfig}
          className="absolute  -right-12 h-[20rem]"
        >
          <RadialBarChart data={chartData} innerRadius={10} outerRadius={150}>
            <PolarGrid gridType="circle" />
            <RadialBar
             
              dataKey="total"
              label={{ position: "insideStart", fill: "#fff", fontSize: 10 }}
            />
            <Tooltip content={<CustomTooltip />} />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Total Services: {services.length}
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total amount for each service
        </div>
      </CardFooter>
    </Card>
  );
}
