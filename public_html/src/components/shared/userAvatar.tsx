"use client";
import { User } from "lucide-react";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";

export default function UserAvatar({
  className,
  user,
}: {
  className?: string;
  user: any;
}) {
  if (!user)
    return (
      <Link href="/login">
        <User
          size={32}
          strokeWidth={2.5}
          className="hover:scale-110 ease-in-out duration-200 p-1.5 text-inherit rounded-xl relative"
        />
      </Link>
    );

  return (
    <div className="z-20 relative hover:scale-110 ease-in-out duration-300 cursor-auto">
      <Avatar className={className}>
        <AvatarImage src={user?.image ?? ""} alt={user?.name ?? ""} />
        <AvatarFallback>
          {user.name ? user.name.slice(0, 2) : user?.email?.slice(0, 2)}
        </AvatarFallback>
      </Avatar>
    </div>
  );
}
