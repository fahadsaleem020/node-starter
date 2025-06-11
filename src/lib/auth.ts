import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { database } from "../configs/connection.config";
import { betterAuth } from "better-auth";
import { env } from "@/utils/env.utils";

export const auth = betterAuth({
  database: drizzleAdapter(database, {
    provider: "pg",
  }),
  secret: env.COOKIE_SECRET,
  rateLimit: {
    window: 60, // time window in seconds
    max: 50, // max requests in the window
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
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
