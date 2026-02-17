"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormEvent, useState } from "react";
import ContinueWithGoogle from "@/components/auth/continue-with-google";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import * as z from "zod";
import { BackButton } from "@/components/auth/back-button";
import { Fetch } from "@/lib/actions/fetch";
import Logo from "@/components/logo";

const signupSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function SignupPage() {
  const [status, setStatus] = useState<"loading" | "idle">("idle");
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const msg = searchParams.get("msg");
  const cb = searchParams.get("callback");

  const router = useRouter();
  const signup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "loading") return;

    const form = new FormData(e.currentTarget);
    const name = form.get("name") as string;
    const email = form.get("email") as string;
    const password = form.get("password") as string;
    const confirmPassword = form.get("confirm-password") as string;

    const result = signupSchema.safeParse({
      name,
      email,
      password,
      confirmPassword,
    });

    if (!result.success) {
      const validationErrors = result.error.flatten().fieldErrors;
      setError(Object.values(validationErrors).flat().join(", "));
      return;
    }

    setStatus("loading");
    setError(null);

    try {
      const { ok, data } = await Fetch(`auth/signup`, {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });

      if (ok) {
        throw new Error(data.error || "An error occurred during signup.");
      }

      if (data.error) {
        setError(data.error);
      } else {
        await signIn("credentials", {
          email,
          password,
          callbackUrl: "/",
        });
      }
    } catch (error: any) {
      setError(error.message);
      if (error.message === "User already exists") {
        toast.error("A user already exists with this email address.", {
          action: (
            <Button
              onClick={() => router.push("/login?email=" + (email ?? ""))}
              variant={"destructive"}
              size={"sm"}
            >
              Login instead
            </Button>
          ),
        });
      }
    } finally {
      setStatus("idle");
    }
  };

  return (
    <div className="flex items-center justify-center py-12">
      <Logo className="absolute top-0 left-0 m-10 scale-90" />
      <div className="mx-auto grid w-[350px] gap-6">
        <div className="grid gap-2 text-center">
          <h1 className="text-3xl font-bold">Create A New Account</h1>
          {error ? (
            <p className="text-xs font-medium text-red-500">{error}</p>
          ) : (
            <p className="text-balance text-muted-foreground">
              Create a new account to get started, Continue with google.
            </p>
          )}
        </div>
        <form onSubmit={signup} className="grid gap-4">
          {/* <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              autoFocus
              name="name"
              id="name"
              type="text"
              placeholder="David Smith"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input name="password" id="password" type="password" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              name="confirm-password"
              type="password"
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
              "Sign Up"
            )}
          </Button> */}
          <ContinueWithGoogle />
        </form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link
            href={`/login${msg ? "?msg=" + msg : ""}`}
            className="underline"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
