import { dbConfig } from "./src/configs/connection.config";
import type { Config } from "drizzle-kit";
import { config } from "dotenv";
config();

export default {
  schema: "./src/**/schema.ts",
  driver: "mysql2",
  out: "./drizzle",
  dbCredentials: dbConfig,
} satisfies Config;
