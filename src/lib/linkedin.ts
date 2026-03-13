import db from "./db";

interface LinkedInPostPayload {
  author: string;
  lifecycleState: "PUBLISHED";
  specificContent: {
    "com.linkedin.ugc.ShareContent": {
      shareCommentary: {
        text: string;
      };
      shareMediaCategory: "NONE";
    };
  };
  visibility: {
    "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" | "CONNECTIONS";
  };
}

interface LinkedInPostResponse {
  id: string;
}


export async function getLinkedInAccessToken(
  userId: string,
): Promise<string | null> {
  const account = await db.account.findFirst({
    where: {
      userId,
      providerId: "linkedin",
    },
    select: {
      accessToken: true,
      accessTokenExpiresAt: true,
    },
  });

  if (!account?.accessToken) {
    return null;
  }

  // Check if token is expired
  if (
    account.accessTokenExpiresAt &&
    new Date() > account.accessTokenExpiresAt
  ) {
    return null;
  }

  return account.accessToken;
}

export async function getLinkedInUserId(accessToken: string): Promise<string> {
  const response = await fetch("https://api.linkedin.com/v2/userinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch LinkedIn user info");
  }

  const data = await response.json();
  return data.sub;
}

export async function publishToLinkedIn(
  accessToken: string,
  content: string,
  visibility: "PUBLIC" | "CONNECTIONS" = "PUBLIC",
): Promise<
  { success: true; postId: string } | { success: false; error: string }
> {
  try {
    // Get LinkedIn user ID (URN)
    const linkedinUserId = await getLinkedInUserId(accessToken);
    const authorUrn = `urn:li:person:${linkedinUserId}`;

    const payload: LinkedInPostPayload = {
      author: authorUrn,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: {
            text: content,
          },
          shareMediaCategory: "NONE",
        },
      },
      visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility": visibility,
      },
    };

    const response = await fetch("https://api.linkedin.com/v2/ugcPosts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message || `LinkedIn API error: ${response.status}`;
      return { success: false, error: errorMessage };
    }

    const data: LinkedInPostResponse = await response.json();
    return { success: true, postId: data.id };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return { success: false, error: errorMessage };
  }
}
