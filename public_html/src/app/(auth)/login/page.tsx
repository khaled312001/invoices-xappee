"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormEvent, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import ContinueWithGoogle from "@/components/auth/continue-with-google";
import { BackButton } from "@/components/auth/back-button";
import { signIn } from "next-auth/react";
import Logo from "@/components/logo";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
  const [status, setStatus] = useState<"loading" | "idle">("idle");
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const searchParams = useSearchParams();
  const msg = searchParams.get("msg");
  const cb = searchParams.get("callback");

  useEffect(() => {
    setEmail(searchParams.get("email") ?? "");
  }, [searchParams]);

  const login = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "loading") return;

    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      const validationErrors = result.error.flatten().fieldErrors;
      setError(Object.values(validationErrors).flat().join(", "));
      return;
    }

    setStatus("loading");
    setError(null);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl: cb ?? "/",
      });
      if (res?.error) {
        setError(res.error);
      } else {
        window.location.href = cb ?? "/";
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setStatus("idle");
    }
  };

  return (
    <div className="flex items-center justify-center py-12 ">
     <Logo className="absolute top-0 left-0 m-10 scale-90"/>
      <div className="mx-auto grid w-[350px] gap-6">
        <div className="grid gap-2 text-center">
          <h1 className="text-3xl font-bold">Login</h1>
          {error && <div className="text-red-500 font-medium">{error}</div>}
          {!error && (
            <p className="text-balance text-muted-foreground">
              {msg ?? "Continue with your google account."}
            </p>
          )}
        </div>
        <form onSubmit={login} className="grid gap-4">
          {/* <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              type="email"
              name="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/forgot-password"
                className="ml-auto inline-block text-sm underline"
              >
                Forgot your password?
              </Link>
            </div>
            <Input
              autoFocus={!!email}
              id="password"
              type="password"
              name="password"
              required
            />
          </div>
          <Button
            disabled={status === "loading"}
            type="submit"
            className="w-full"
          >
            {status === "loading" ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Login"
            )}
          </Button> */}
          <ContinueWithGoogle />
        </form>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
