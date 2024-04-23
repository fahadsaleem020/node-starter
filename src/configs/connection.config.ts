import { MySql2Database, drizzle } from "drizzle-orm/mysql2";
import { migrate } from "drizzle-orm/mysql2/migrator";
import * as schema from "@/schema/schema";
import mysql from "mysql2/promise";
import { config } from "dotenv";
config();

export const database = async (logger = false) => {
  const db = drizzle(client, {
    mode: "default",
    logger,
    schema,
  });
  return db;
};

export const dbConfig = {
  port: Number(process.env.dbport),
  password: process.env.password,
  database: process.env.database!,
  host: process.env.host!,
  user: process.env.user,
};

export const client = mysql.createPool(dbConfig);

export const migrateSchema = async (
  db: MySql2Database<Record<string, unknown>>
) => await migrate(db, { migrationsFolder: "drizzle" });
