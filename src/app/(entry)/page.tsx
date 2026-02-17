"use client";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex h-[75vh] flex-col items-center justify-center ">
      <div className="">
        <Image
          className="relative hover:scale-150 ease-out duration-500 hover:brightness-125"
          src="/logo.png"
          alt="Next.js Logo"
          width={280}
          height={40}
          priority
        />
      </div>
    </main>
  );
}
