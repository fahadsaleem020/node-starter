import {
  text,
  pgTable,
  varchar,
  boolean,
  timestamp,
  ReferenceConfig,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { createInsertSchema } from "drizzle-zod";

const timeStamps = {
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().$onUpdateFn(() => new Date()),
};

type UUIDOptions = Exclude<Parameters<typeof varchar>[1], undefined>;

const uuid = (columnName?: string, options?: UUIDOptions) =>
  varchar(columnName ?? "id", options).$defaultFn(() => createId());

const foreignkeyRef = (
  columnName: string,
  refColumn: ReferenceConfig["ref"],
  actions?: ReferenceConfig["actions"]
) => varchar(columnName, { length: 128 }).references(refColumn, actions);

export const users = pgTable("users", {
  id: uuid().primaryKey(),
  firstName: varchar({ length: 100 }),
  lastName: varchar({ length: 100 }),
  profilePic: varchar({ length: 256 }),
  password: varchar({ length: 100 }).notNull(),
  email: varchar({ length: 100 }).notNull().unique(),
  emailVerified: boolean()
    .$defaultFn(() => false)
    .notNull(),
  userRoles: varchar(["user", "admin"]).default("user"),
  ...timeStamps,
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp().notNull(),
  token: text().notNull().unique(),
  createdAt: timestamp().notNull(),
  updatedAt: timestamp().notNull(),
  ipAddress: text(),
  userAgent: text(),
  userId: text()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text().notNull(),
  providerId: text().notNull(),
  userId: foreignkeyRef("user_id", () => users.id, { onDelete: "cascade" }),
  accessToken: text(),
  refreshToken: text(),
  idToken: text(),
  accessTokenExpiresAt: timestamp(),
  refreshTokenExpiresAt: timestamp(),
  scope: text(),
  password: text(),
  createdAt: timestamp().notNull(),
  updatedAt: timestamp().notNull(),
});

export const verification = pgTable("verification", {
  id: text().primaryKey(),
  identifier: text().notNull(),
  value: text().notNull(),
  expiresAt: timestamp().notNull(),
  createdAt: timestamp().$defaultFn(() => new Date()),
  updatedAt: timestamp().$defaultFn(() => new Date()),
});

export const userInsertSchema = createInsertSchema(users);
