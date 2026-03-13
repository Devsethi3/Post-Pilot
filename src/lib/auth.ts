import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import db from "./db";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),

  // Email/Password authentication
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },

  // Social authentication providers
  socialProviders: {
    linkedin: {
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,

      // Required scopes for LinkedIn login + posting
      scope: ["openid", "profile", "email", "w_member_social"],
    },
  },

  // Session configuration
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },

  // Account linking
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["linkedin"],
    },
  },

  // Security
  trustedOrigins: [process.env.BETTER_AUTH_URL || "http://localhost:3000"],
});

// Types
export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
