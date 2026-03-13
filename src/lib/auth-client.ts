import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  // Social auth methods are included in signIn
} = authClient;

// Type exports for better TypeScript support
export type AuthClient = typeof authClient;
