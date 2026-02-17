"use client";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Card } from "../ui/card";
import { UserCardMenu } from "./menu";


export default function UserCard({ userData }: { userData: any }) {
  if (!userData) return null;
  return (
    <Card className="border-none p-4 rounded-md flex flex-row justify-between items-center">
      <p className="text-sm  text-muted-foreground  font-medium">
        {userData.email}
      </p>

      <div className="flex items-center gap-2">
        {/* <Link href={`/clients/${userData.name}/invoices`} className="w-full">
          <span className="text-2xl capitalize  flex justify-between items-center">
            {userData.name.replace("-", " ")}{" "}
            <ArrowUpRight
              className="hover:bg-foreground hover:text-background rounded-md p-2"
              size={35}
            />
          </span>
        </Link> */}
        <UserCardMenu user={userData} />
      </div>



    </Card>
  );
}
