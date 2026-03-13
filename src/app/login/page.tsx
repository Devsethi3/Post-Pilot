"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <HugeiconsIcon
              icon={Linkedin01Icon}
              className="h-6 w-6 text-primary"
            />
          </div>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>
            Sign in with your LinkedIn account to start publishing posts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleLinkedInSignIn}
            className="w-full gap-2"
            size="lg"
          >
            <HugeiconsIcon icon={Linkedin01Icon} className="h-5 w-5" />
            Sign in with LinkedIn
          </Button>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            By signing in, you agree to our Terms of Service and Privacy Policy.
            We&apos;ll only access your profile information and ability to post.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
