import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import {
  ReferenceConfig,
  MySqlColumn,
  mediumtext,
  mysqlTable,
  timestamp,
  mysqlEnum,
  varchar,
  boolean,
  json,
  text,
  int,
} from "drizzle-orm/mysql-core";

const timeStamps = {
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
};

const uuid = (columnName: string) =>
  varchar(columnName, { length: 128 }).$defaultFn(() => createId());

const foreignkeyRef = (
  columnName: string,
  refColumn: MySqlColumn,
  actions?: ReferenceConfig["actions"]
) => {
  return varchar(columnName, { length: 128 }).references(
    () => refColumn,
    actions
  );
};

export const users = mysqlTable("users", {
  id: uuid("id").primaryKey(),
  fullName: varchar("full_name", { length: 100 }),
  email: varchar("email", { length: 100 }).notNull().unique(),
  profilePic: varchar("profile_pic_url", { length: 256 }),
  password: varchar("password", { length: 100 }).notNull(),
  userRoles: mysqlEnum("user_roles", ["user", "admin"]).default("user"),
  ...timeStamps,
});

export const usersrelations = relations(users, ({ many, one }) => ({
  notifications: many(notifications),
  addresses: many(address),
  contacts: many(contact),
  profileInfo: one(profileInfo, {
    fields: [users.id],
    references: [profileInfo.userId],
  }),
}));

export const profileInfo = mysqlTable("profile_info", {
  id: uuid("id").primaryKey(),
  metaData: json("meta_data"),
  userId: foreignkeyRef("user_id", users.id, { onDelete: "cascade" })
    .notNull()
    .unique(),
});

export const notifications = mysqlTable("notifications", {
  id: uuid("id").primaryKey(),
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  status: mysqlEnum("status", ["read", "undread"]).notNull(),
  userId: foreignkeyRef("user_id", users.id, { onDelete: "cascade" }).notNull(),
});

export const notificationsrelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export const address = mysqlTable("address", {
  id: uuid("id").primaryKey(),
  street: varchar("street", { length: 256 }).notNull(),
  city: varchar("city", { length: 150 }).notNull(),
  state: varchar("state", { length: 100 }).notNull(),
  postalCode: varchar("postal_code", { length: 50 }).notNull(),
  country: varchar("country", { length: 100 }).notNull(),
  userId: foreignkeyRef("user_id", users.id, { onDelete: "cascade" }).notNull(),
});

export const addressrelations = relations(address, ({ one }) => ({
  user: one(users, {
    fields: [address.userId],
    references: [users.id],
  }),
}));

export const contact = mysqlTable("contact", {
  id: uuid("id").primaryKey(),
  emails: json("emails").notNull().$type<
    {
      provider: "gmail" | "facebook" | "twitter" | "linkedin";
      email: string;
    }[]
  >(),
  number: varchar("number", { length: 50 }).notNull().unique(),
  verified: boolean("verified").notNull(),
  userId: foreignkeyRef("user_id", users.id, { onDelete: "cascade" }).notNull(),
});

export const contactrelations = relations(contact, ({ one }) => ({
  user: one(users, {
    fields: [contact.userId],
    references: [users.id],
  }),
}));

export const verification = mysqlTable("verification", {
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

export const session = mysqlTable("sessions", {
  sessionId: varchar("session_id", { length: 128 }).primaryKey().notNull(),
  expires: int("expires").notNull(),
  data: mediumtext("data"),
  ...timeStamps,
});
