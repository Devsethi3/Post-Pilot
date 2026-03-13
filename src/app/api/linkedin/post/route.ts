import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getLinkedInAccessToken, publishToLinkedIn } from "@/lib/linkedin";
import { headers } from "next/headers";
import { z } from "zod";
import db from "@/lib/db";

const postSchema = z.object({
  content: z
    .string()
    .min(1, "Content is required")
    .max(3000, "Content must be less than 3000 characters"),
});

export async function POST(request: NextRequest) {
  try {
    // Get session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = postSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues[0].message },
        { status: 400 },
      );
    }

    const { content } = validationResult.data;

    // Get LinkedIn access token
    const accessToken = await getLinkedInAccessToken(session.user.id);

    if (!accessToken) {
      return NextResponse.json(
        {
          error:
            "LinkedIn account not connected or token expired. Please reconnect.",
        },
        { status: 401 },
      );
    }

    // Create post record with pending status
    const post = await db.post.create({
      data: {
        content,
        status: "PENDING",
        userId: session.user.id,
      },
    });

    // Publish to LinkedIn
    const result = await publishToLinkedIn(accessToken, content);

    if (result.success) {
      // Update post with success status
      await db.post.update({
        where: { id: post.id },
        data: {
          status: "PUBLISHED",
          linkedinPostId: result.postId,
        },
      });

      return NextResponse.json({
        success: true,
        postId: post.id,
        linkedinPostId: result.postId,
      });
    } else {
      // Update post with failed status
      await db.post.update({
        where: { id: post.id },
        data: {
          status: "FAILED",
          errorMessage: result.error,
        },
      });

      return NextResponse.json({ error: result.error }, { status: 500 });
    }
  } catch (error) {
    console.error("LinkedIn post error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
