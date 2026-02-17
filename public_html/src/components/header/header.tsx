import Link from "next/link";
import { HeaderAvatarMenu } from "./menu";
import {
  Box,
  ChevronDown,
  Edit,
  FileText,
  Package,
  PackageOpen,
  Settings,
  Shield,
  ShoppingCart,
  Truck,
  UploadCloud,
  UserCircle,
  UserIcon,
  Users,
  Users2,
} from "lucide-react";
import NavLink, { NavLinkText } from "./navLink";
import Backbutton from "./backbutton";
import { getCurrentSession } from "../../lib/auth";
import Image from "next/image";
import { ToggleThemeBtn } from "../shared/toggleThemeBtn";
import {
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenu,
} from "../ui/dropdown-menu";

export default async function Header() {
  const session = await getCurrentSession();
  const user = session?.user;
  return (
    <div className="h-[var(--header-height)] ">
      <div className=" w-full h-[var(--header-height)] bg-background z-50 border-b border-input px-10 py-4 flex justify-between items-center ">
        <div className="flex gap-[7vw]">
          <Link href="/">
            <Image
              priority
              className={`text-center w-[100px]  relative top-[2px]`}
              src="/logo.png"
              alt="xappee"
              width="200"
              height="200"
            />
          </Link>
          <div className="flex items-center gap-2">
            <Backbutton />
            {
              user && user.role === "admin" && (
                <>
                  <NavLink href="/fulfillment">
                    <Truck size={17} /> <NavLinkText>Fullfilment</NavLinkText>
                  </NavLink>
                  <NavLink href="/storage">
                    <PackageOpen size={17} />
                    <NavLinkText>Storage</NavLinkText>
                  </NavLink>
                </>
              )
            }

            <NavLink href="/items">
              <Package size={17} />
              <NavLinkText>Items</NavLinkText>
            </NavLink>
            {
              user && user.role === "admin" && (
                <>
                  <NavLink href="/clients">
                    <Users2 size={15} /> <NavLinkText>Clients</NavLinkText>
                  </NavLink>
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger>
                      <span className="w-full flex gap-2 items-center font-medium text-sm">
                        <UploadCloud size={15} />
                        Upload <ChevronDown size={15} />
                      </span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <Link className="" href="/fulfillment/upload">
                        <DropdownMenuItem className="w-full flex justify-between items-center gap-4">
                          <span>Orders</span> <ShoppingCart size={15} />
                        </DropdownMenuItem>
                      </Link>

                      <Link className="" href="/items/upload">
                        <DropdownMenuItem className="w-full flex justify-between items-center gap-4">
                          <span>Items</span> <Package size={15} />
                        </DropdownMenuItem>
                      </Link>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <NavLink href="/charges">
                    <Edit size={15} /> <NavLinkText>Charges</NavLinkText>
                  </NavLink>
                </>
              )
            }

            <NavLink href="/invoices">
              <FileText size={15} /> <NavLinkText>Invoices</NavLinkText>
            </NavLink>

            {
              user && user.role === "admin" && (
                <NavLink href="/users">
                  <UserIcon size={15} /> <NavLinkText>Users</NavLinkText>
                </NavLink>
              )
            }

            {
              user && user.role === "user" && (
              <>
                <NavLink href={`/clients/${user.client}/invoices?type=fulfillment`}>
                  <Truck size={15} /> <NavLinkText>Fulfilment Invoices</NavLinkText>
                </NavLink>
                  <NavLink href={`/clients/${user.client}/invoices?type=storage`}>
                  <Box size={15} /> <NavLinkText>Storage Invoices</NavLinkText>
                </NavLink>
                </>
              )
            }
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ToggleThemeBtn />
          <HeaderAvatarMenu user={session?.user} />
        </div>
      </div>
    </div>
  );
}
