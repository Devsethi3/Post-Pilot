"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { formatDate } from "@/lib/utils";
import {
  Cancel01Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  Loading03Icon,
  RefreshIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface Post {
  id: string;
  content: string;
  status: "PENDING" | "PUBLISHED" | "FAILED";
  linkedinPostId: string | null;
  errorMessage: string | null;
  createdAt: string;
}

interface PostListProps {
  refreshTrigger?: number;
}

const statusConfig = {
  PENDING: {
    label: "Pending",
    variant: "warning" as const,
    icon: Clock01Icon,
  },
  PUBLISHED: {
    label: "Published",
    variant: "success" as const,
    icon: CheckmarkCircle02Icon,
  },
  FAILED: {
    label: "Failed",
    variant: "destructive" as const,
    icon: Cancel01Icon,
  },
};

export function PostList({ refreshTrigger }: PostListProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/linkedin/posts");

      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }

      const data = await response.json();
      setPosts(data.posts);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [refreshTrigger]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-10">
          <HugeiconsIcon
            icon={Loading03Icon}
            className="h-8 w-8 animate-spin text-muted-foreground"
          />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button variant="outline" onClick={fetchPosts}>
            <HugeiconsIcon icon={RefreshIcon} className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Your Posts</CardTitle>
          <CardDescription>
            View all posts published through this app.
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={fetchPosts}>
          <HugeiconsIcon icon={RefreshIcon} className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {posts.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No posts yet. Create your first post above!
          </p>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => {
              const config = statusConfig[post.status];
              const StatusIcon = config.icon;

              return (
                <div
                  key={post.id}
                  className="flex flex-col space-y-2 rounded-lg border p-4"
                >
                  <div className="flex items-start justify-between">
                    <p className="text-sm text-foreground line-clamp-3 flex-1">
                      {post.content}
                    </p>
                    <Badge className="ml-4 shrink-0">
                      <HugeiconsIcon
                        icon={StatusIcon}
                        className="mr-1 h-3 w-3"
                      />
                      {config.label}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{formatDate(new Date(post.createdAt))}</span>
                    {post.linkedinPostId && (
                      <span className="font-mono">
                        ID: {post.linkedinPostId.slice(-8)}
                      </span>
                    )}
                  </div>
                  {post.errorMessage && (
                    <p className="text-xs text-destructive">
                      {post.errorMessage}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
