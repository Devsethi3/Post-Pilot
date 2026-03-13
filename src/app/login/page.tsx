"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { DecorIcon } from "@/components/ui/decor-icon";
import { Button } from "@/components/ui/button";
import { AuthDivider } from "@/components/auth-divider";
import { HugeiconsIcon } from "@hugeicons/react";
import { Linkedin01Icon, Loading03Icon } from "@hugeicons/core-free-icons";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (session && !isPending) {
      router.push("/dashboard");
    }
  }, [session, isPending, router]);

  const handleLinkedInSignIn = async () => {
    await signIn.social({
      provider: "linkedin",
      callbackURL: "/dashboard",
    });
  };

  if (isPending) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <HugeiconsIcon
          icon={Loading03Icon}
          className="h-8 w-8 animate-spin text-primary"
        />
      </div>
    );
  }

  if (session) {
    return null;
  }

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] w-full items-center justify-center overflow-hidden px-6 md:px-8">
      <div
        className={cn(
          "relative flex w-full max-w-sm flex-col justify-between p-6 md:p-8",
          "dark:bg-[radial-gradient(50%_80%_at_20%_0%,--theme(--color-foreground/.1),transparent)]",
        )}
      >
        {/* Decorative borders */}
        <div className="absolute -inset-y-6 -left-px w-px bg-border" />
        <div className="absolute -inset-y-6 -right-px w-px bg-border" />
        <div className="absolute -inset-x-6 -top-px h-px bg-border" />
        <div className="absolute -inset-x-6 -bottom-px h-px bg-border" />
        <DecorIcon position="top-left" />
        <DecorIcon position="bottom-right" />

        <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
          {/* Header */}
          <div className="flex flex-col space-y-1 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <HugeiconsIcon
                icon={Linkedin01Icon}
                className="h-6 w-6 text-primary"
              />
            </div>
            <h1 className="font-bold text-2xl tracking-wide">Welcome Back</h1>
            <p className="text-base text-muted-foreground">
              Sign in to start publishing your LinkedIn posts.
            </p>
          </div>

          {/* Auth buttons */}
          <div className="space-y-4">
            {/* Primary LinkedIn button */}
            <Button
              onClick={handleLinkedInSignIn}
              className="w-full gap-2"
              size="lg"
            >
              <HugeiconsIcon icon={Linkedin01Icon} className="h-5 w-5" />
              Continue with LinkedIn
            </Button>

            <AuthDivider>OR</AuthDivider>
          </div>

          {/* Terms */}
          <p className="text-muted-foreground text-sm text-center">
            By clicking continue, you agree to our{" "}
            <a
              className="underline underline-offset-4 hover:text-primary transition-colors"
              href="/terms"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              className="underline underline-offset-4 hover:text-primary transition-colors"
              href="/privacy"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
