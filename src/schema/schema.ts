import {
  text,
  pgTable,
  integer,
  varchar,
  boolean,
  timestamp,
  // ReferenceConfig,
} from "drizzle-orm/pg-core";
// import { createInsertSchema } from "drizzle-zod";
// import { createId } from "@paralleldrive/cuid2";

// const timeStamps = {
//   createdAt: timestamp().defaultNow(),
//   updatedAt: timestamp().$onUpdateFn(() => new Date()),
// };

// type UUIDOptions = Exclude<Parameters<typeof varchar>[1], undefined>;

// const uuid = (columnName?: string, options?: UUIDOptions) =>

export const verification = pgTable("verification", {
  id: text().primaryKey(),
  identifier: text().notNull(),
  value: text().notNull(),
  expiresAt: timestamp().notNull(),
  createdAt: timestamp().$defaultFn(() => new Date()),
  updatedAt: timestamp().$defaultFn(() => new Date()),
});

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
