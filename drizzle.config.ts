import { defineConfig, type Config } from "drizzle-kit";
import { env } from "./src/utils/env.utils";

export default defineConfig({
  dbCredentials: {
    url: env.CONNECTION_URL,
  },
  schema: "./src/schema/schema.ts",
  dialect: "postgresql",
});
