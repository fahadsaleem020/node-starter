import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import mysql, { type PoolOptions } from "mysql2";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "@/schema/schema";
import { env } from "@/utils/env.utils";

export const database = async (logger = false) =>
  drizzle({
    casing: "snake_case",
    client: neon(env.CONNECTION_URL),
    logger,
    schema,
  });

export const dbConfig: PoolOptions = {
  uri: env.CONNECTION_URL,
};

export const connection = mysql.createPool(dbConfig);

export const migrateSchema = async (
  db: PostgresJsDatabase<Record<string, unknown>>
) => await migrate(db, { migrationsFolder: "drizzle" });
