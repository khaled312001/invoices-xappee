"use client";
import Image from "next/image";
import "../globals.css";
import InvoiceImage from "../../../public/invoices.png";
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="w-full items-center h-screen grid lg:grid-cols-2">
      {children}
      <div className="hidden bg-muted lg:block">
        <Image
          priority
          src={InvoiceImage}
          alt="Image"
          width="800"
          height="1000"
          className="object-cover w-full h-screen "
        />
      </div>
    </main>
  );
}
