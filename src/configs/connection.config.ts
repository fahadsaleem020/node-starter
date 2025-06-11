import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "@/schema/schema";
import { env } from "@/utils/env.utils";

export const database = async (logger = false) =>
  drizzle({
    client: neon(env.CONNECTION_URL),
    casing: "snake_case",
    logger,
    schema,
  });

export const migrateSchema = async (
  db: PostgresJsDatabase<Record<string, unknown>>
) => await migrate(db, { migrationsFolder: "drizzle" });
