"use client";
import { cn } from "@/lib/utils";
import Link, { LinkProps } from "next/link";
import React, { ReactNode } from "react";
import { usePathname } from "next/navigation";

interface NavLinkProps extends LinkProps {
  children: ReactNode | string;
  className?: string;
}

const NavLink: React.FC<NavLinkProps> = ({ children, className, ...props }) => {
  const pathname = usePathname();
  const isActiveRoute = pathname === props.href;
  return (
    <Link
      className={cn(
        `w-full flex items-center rounded-sm py-1 px-2 text-sm font-medium  
       ${
         isActiveRoute
           ? "text-muted-foreground opacity-70 cursor-default "
           : "hover:bg-secondary "
       }
     "justify-between "} `,
        className
      )}
      {...props}
    >
      <span className="flex items-center gap-2 ">{children}</span>
    </Link>
  );
};

export default NavLink;

export const NavLinkText = ({ children }: { children: string }) => {
  return <span className="text-nowrap">{children}</span>;
};
