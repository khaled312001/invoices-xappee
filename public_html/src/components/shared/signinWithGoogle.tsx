"use client";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const SignInWithGoogle = () => {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const url = searchParams.get("callbackUrl ");

  useEffect(() => {
    return setLoading(false);
  }, []);
  return (
    <Button
      className="flex w-full rounded-xl  h-10 font-normal relative gap-2  overflow-hidde bg-blue-700 text-white hover:text-white hover:bg-blue-800"
      variant={"ghost"}
      onClick={() => {
        setLoading(true);
        signIn("google", { callbackUrl: url || "/" });
      }}
    >
      {loading ? (
        <span className="flex gap-2 text-base items-center">
          <Loader2Icon size={16} className="relative top-[1px] animate-spin" /> Signing you in
        </span>
      ) : (
        <>
          <Image
            src={"https://www.svgrepo.com/show/304493/google.svg"}
            width={18}
            height={18}
            priority
            alt="G"
            className=" bg-gray-50 w-[24%]  sm:w-[20%order-input borde] h-10  p-2 absolute -left-[1px] rounded-l-xl  "
          />
          <span className="text-center sm:block text-base font-medium ml-[24%]">
            Continue with Google
          </span>
        </>
      )}
    </Button>
  );
};
