"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { PostForm } from "@/components/post-form";
import { PostList } from "@/components/post-list";
import { HugeiconsIcon } from "@hugeicons/react";
import { Loading03Icon } from "@hugeicons/core-free-icons";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (!session && !isPending) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  const handlePostCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
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

  if (!session) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-2xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Welcome back, {session.user.name.split(" ")[0]}! Create and manage
            your LinkedIn posts.
          </p>
        </div>

        <PostForm onPostCreated={handlePostCreated} />
        <PostList refreshTrigger={refreshTrigger} />
      </div>
    </div>
  );
}
