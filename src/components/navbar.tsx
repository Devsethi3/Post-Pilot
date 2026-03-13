"use client";

import Link from "next/link";
import { useSession, signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DashboardCircleIcon,
  Linkedin01Icon,
  Loading01Icon,
  SignOut,
} from "@hugeicons/core-free-icons";

export function Navbar() {
  const { data: session, isPending } = useSession();

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <HugeiconsIcon
            icon={Linkedin01Icon}
            className="h-6 w-6 text-primary"
          />
          <span className="text-xl font-bold">LinkedIn Publisher</span>
        </Link>

        <div className="flex items-center space-x-4">
          {isPending ? (
            <HugeiconsIcon
              icon={Loading01Icon}
              className="h-5 w-5 animate-spin text-muted-foreground"
            />
          ) : session ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <HugeiconsIcon
                    icon={DashboardCircleIcon}
                    className="mr-2 h-4 w-4"
                  />
                  Dashboard
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                {session.user.image && (
                  <img
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    className="h-8 w-8 rounded-full"
                  />
                )}
                <span className="text-sm font-medium">{session.user.name}</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => signOut()}>
                <HugeiconsIcon icon={SignOut} className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button>Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
