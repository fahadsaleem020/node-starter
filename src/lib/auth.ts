import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { database } from "../configs/connection.config";
import * as schema from "@/schema/schema";
import { betterAuth } from "better-auth";
import { env } from "@/utils/env.utils";

export const auth = betterAuth({
  database: drizzleAdapter(database, { provider: "pg", schema }),
  secret: env.COOKIE_SECRET,
  trustedOrigins: [env.FRONTEND_DOMAIN],
  session: {
    cookieCache: {
      enabled: true, // Enable caching session in cookie
      maxAge: 5 * 60, // 5 minuets
    },
  },
  emailAndPassword: {
    sendResetPassword: async () => {
      // Send reset password email
    },
    maxPasswordLength: 10,
    minPasswordLength: 8,
    autoSignIn: true,
    enabled: true,
  },
  emailVerification: {
    sendVerificationEmail: async () => {
      // Send verification email to user
    },
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
  },
  user: {
    modelName: "users",
    fields: {
      image: "profilePic",
      name: "fullName",
    },
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async () => {
        // Send change email verification
      },
    },
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification: async () => {
        // Send delete account verification
      },
      beforeDelete: async () => {
        // Perform actions before user deletion
      },
      afterDelete: async () => {
        // Perform cleanup after user deletion
      },
    },
  },
});
