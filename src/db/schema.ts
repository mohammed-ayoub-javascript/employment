import { int, mysqlTable, varchar, json, timestamp } from 'drizzle-orm/mysql-core';

export const usersTable = mysqlTable('admin', {
  id: int("id").notNull().primaryKey().autoincrement(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  image: varchar("image", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const category = mysqlTable("category", {
  id: int("id").notNull().primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const discount = mysqlTable("discount", {
  id: int("id").notNull().primaryKey().autoincrement(),
  percentage: int("percentage").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const products = mysqlTable("products", {
  id: int("id").notNull().primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  description: varchar("description", { length: 1000 }).notNull(),
  images: json("images").notNull(),
  categoryId: int("category_id").notNull().references(() => category.id, { onDelete: "cascade" }),
  discountId: int("discount_id").references(() => discount.id, { onDelete: "set null" }),
  price: varchar("price", { length: 255 }).notNull(),
  number: varchar("number", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});
