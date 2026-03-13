"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DashboardCircleIcon,
  Menu01Icon,
  Cancel01Icon,
  Settings01Icon,
  Logout01Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { ModeToggle } from "./ui/theme-toggle";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: DashboardCircleIcon },
] as const;

function UserAvatar({
  image,
  name,
  className = "h-8 w-8",
}: {
  image?: string | null;
  name?: string | null;
  className?: string;
}) {
  const initials =
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  return (
    <Avatar className={className}>
      <AvatarImage src={image || undefined} alt={name || "User avatar"} />
      <AvatarFallback className="text-xs font-medium">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}

export function Navbar() {
  const { data: session, isPending } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav className="max-w-6xl mx-auto flex h-14 items-center justify-between px-4 sm:h-16">
          <Link
            href="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <span className="text-lg font-medium sm:text-xl">Post Pilot</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {isPending ? (
              <div className="flex items-center gap-4">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            ) : session ? (
              <>
                {NAV_LINKS.map(({ href, label, icon }) => (
                  <Link key={href} href={href}>
                    <Button
                      variant={pathname === href ? "secondary" : "outline"}
                      size="lg"
                    >
                      <HugeiconsIcon icon={icon} className="mr-2 h-4 w-4" />
                      {label}
                    </Button>
                  </Link>
                ))}

                <ModeToggle />

                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <UserAvatar
                      image={session.user.image}
                      name={session.user.name}
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium truncate">
                        {session.user.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {session.user.email}
                      </p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => signOut()}
                      className="text-destructive h-8 focus:text-destructive cursor-pointer"
                    >
                      <HugeiconsIcon
                        icon={Logout01Icon}
                        className="mr-2 h-4 w-4"
                      />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link href="/login">
                <Button size="lg">Sign In</Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <ModeToggle />
            {isPending ? (
              <Skeleton className="h-8 w-8 rounded-full" />
            ) : session ? (
              <Button
                variant="outline"
                size="icon-lg"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
              >
                <HugeiconsIcon
                  icon={mobileMenuOpen ? Cancel01Icon : Menu01Icon}
                  className="h-5 w-5"
                />
              </Button>
            ) : (
              <Link href="/login">
                <Button size="lg">Sign In</Button>
              </Link>
            )}
          </div>
        </nav>
      </header>

      {/* Mobile Menu - Rendered outside header as a portal-like overlay */}
      {session && mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-[100]"
          style={{ top: "3.5rem" }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Menu Panel - Using hardcoded white/dark colors */}
          <div className="absolute inset-x-0 top-0 border-t border-b shadow-xl bg-white dark:bg-neutral-950">
            <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col">
              {/* User Info */}
              <div className="flex items-center gap-3 pb-4 border-b">
                <UserAvatar
                  image={session.user.image}
                  name={session.user.name}
                  className="h-10 w-10"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{session.user.name}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {session.user.email}
                  </p>
                </div>
              </div>

              {/* Nav Links */}
              <nav className="py-4 space-y-1">
                {NAV_LINKS.map(({ href, label, icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      pathname === href
                        ? "bg-secondary text-secondary-foreground"
                        : "hover:bg-accent",
                    )}
                  >
                    <HugeiconsIcon icon={icon} className="h-5 w-5" />
                    {label}
                  </Link>
                ))}
              </nav>

              {/* Sign Out */}
              <div className="pt-4 border-t">
                <Button
                  variant="outline"
                  size={"lg"}
                  className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                >
                  <HugeiconsIcon icon={Logout01Icon} className="mr-2 h-4 w-4" />
                  Sign out
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
