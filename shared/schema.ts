import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Rules schema
export const rules = pgTable("rules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  severity: varchar("severity", { length: 10 }).notNull(), // "hard" | "soft"
  expression: text("expression").notNull(),
  ruleType: varchar("rule_type", { length: 20 }), // "tightly-coupled" | "loosely-coupled"
  dataSource: text("data_source"),
  tableObject: text("table_object"),
  selectedColumns: text("selected_columns"), // JSON array as text
  status: varchar("status", { length: 20 }), // "active" | "inactive" | "draft"
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const insertRuleSchema = createInsertSchema(rules).pick({
  name: true,
  description: true,
  category: true,
  severity: true,
  expression: true,
  ruleType: true,
  dataSource: true,
  tableObject: true,
  selectedColumns: true,
  status: true,
});

export type InsertRule = z.infer<typeof insertRuleSchema>;
export type Rule = typeof rules.$inferSelect;
