"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { Loading03Icon, SentIcon } from "@hugeicons/core-free-icons";

const postSchema = z.object({
  content: z
    .string()
    .min(1, "Post content is required")
    .max(3000, "Post content must be less than 3000 characters"),
});

type PostFormData = z.infer<typeof postSchema>;

interface PostFormProps {
  onPostCreated?: () => void;
}

export function PostForm({ onPostCreated }: PostFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      content: "",
    },
  });

  const content = watch("content");
  const characterCount = content?.length || 0;

  const onSubmit = async (data: PostFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/linkedin/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: data.content }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to publish post");
      }

      toast.success("Your post has been published to LinkedIn.");

      reset();
      onPostCreated?.();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to publish post",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a Post</CardTitle>
        <CardDescription>
          Write your post content below and publish it directly to LinkedIn.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Textarea
              placeholder="What do you want to share with your network?"
              className="min-h-[150px] resize-none"
              {...register("content")}
              disabled={isSubmitting}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>
                {errors.content ? (
                  <span className="text-destructive">
                    {errors.content.message}
                  </span>
                ) : (
                  "Share your thoughts, insights, or updates"
                )}
              </span>
              <span className={characterCount > 2800 ? "text-destructive" : ""}>
                {characterCount}/3000
              </span>
            </div>
          </div>
          <Button
            type="submit"
            size={"lg"}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? (
              <>
                <HugeiconsIcon
                  icon={Loading03Icon}
                  className="mr-2 h-4 w-4 animate-spin"
                />
                Publishing...
              </>
            ) : (
              <>
                <HugeiconsIcon icon={SentIcon} className="mr-2 h-4 w-4" />
                Publish to LinkedIn
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
