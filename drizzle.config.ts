import type { Config } from "drizzle-kit";
import { config } from "dotenv";
config();

export default {
  schema: "./src/**/schema.ts",
  driver: "mysql2",
  out: "./drizzle",
  dbCredentials: {
    password: process.env.password!,
    host: process.env.host!,
    database: process.env.database!,
    user: process.env.user!,
  },
} satisfies Config;
