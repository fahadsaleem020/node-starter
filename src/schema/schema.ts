import {
  text,
  json,
  pgTable,
  varchar,
  boolean,
  integer,
  timestamp,
  ReferenceConfig,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
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
  userRoles: varchar(["user", "admin"]).default("user"),
  ...timeStamps,
});

export const usersrelations = relations(users, ({ many, one }) => ({
  contacts: many(contact),
  addresses: many(address),
  profileInfo: one(profileInfo, {
    fields: [users.id],
    references: [profileInfo.userId],
  }),
}));

export const profileInfo = pgTable("profile_info", {
  id: uuid("id").primaryKey(),
  metaData: json("meta_data"),
  userId: foreignkeyRef("user_id", () => users.id, { onDelete: "cascade" })
    .notNull()
    .unique(),
});

export const address = pgTable("address", {
  id: uuid("id").primaryKey(),
  country: varchar("country", { length: 100 }).notNull(),
  userId: foreignkeyRef("user_id", () => users.id, {
    onDelete: "cascade",
  }).notNull(),
});

export const addressrelations = relations(address, ({ one }) => ({
  user: one(users, {
    fields: [address.userId],
    references: [users.id],
  }),
}));

export const contact = pgTable("contact", {
  id: uuid("id").primaryKey(),
  emails: json("emails").notNull().$type<
    {
      provider: "gmail" | "facebook" | "twitter" | "linkedin";
      email: string;
    }[]
  >(),
  number: varchar("number", { length: 50 }).notNull().unique(),
  verified: boolean("verified").notNull(),
  userId: foreignkeyRef("user_id", () => users.id, {
    onDelete: "cascade",
  }).notNull(),
});

export const contactrelations = relations(contact, ({ one }) => ({
  user: one(users, {
    fields: [contact.userId],
    references: [users.id],
  }),
}));

export const throttleinsight = pgTable("throttle_insight", {
  waitTime: integer("wait_time").notNull(),
  msBeforeNext: integer("ms_before_next").notNull(),
  endPoint: varchar("end_point", { length: 225 }),
  pointsAllotted: integer("allotted_points").notNull(),
  consumedPoints: integer("consumed_points").notNull(),
  remainingPoints: integer("remaining_points").notNull(),
  key: varchar("key", { length: 225 }).primaryKey().notNull(),
  isFirstInDuration: boolean("is_first_in_duration").notNull(),
});

export const verification = pgTable("verification", {
  id: uuid("id").primaryKey(),
  token: text("token").notNull(),
  email: varchar("email", { length: 100 }).notNull().unique(),
});

export const verificationrelations = relations(verification, ({ one }) => ({
  user: one(users, {
    fields: [verification.email],
    references: [users.email],
  }),
}));

export const sessions = pgTable("sessions", {
  sessionId: varchar("session_id", { length: 128 }).primaryKey().notNull(),
  expires: integer("expires").notNull(),
  data: text("data"),
  ...timeStamps,
});

export const userInsertSchema = createInsertSchema(users);
