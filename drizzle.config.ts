import type { Config } from "drizzle-kit";
import { config } from "dotenv";
config();

export default {
  schema: "./src/**/schema.ts",
  driver: "mysql2",
  out: "./drizzle",
  dbCredentials: {
    port: Number(process.env.dbport!),
    password: process.env.password!,
    database: process.env.database!,
    host: process.env.host!,
    user: process.env.user!,
  },
} satisfies Config;
