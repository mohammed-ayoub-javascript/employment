import { int, mysqlTable, serial, varchar } from 'drizzle-orm/mysql-core';

export const usersTable = mysqlTable('admin', {
id: int("id").notNull().primaryKey().autoincrement(),
  username : varchar("username",{length : 255}).notNull().unique(),
  email : varchar("email",{length : 255}).notNull().unique(),
  image : varchar("image",{length : 255}).notNull().unique(),
});


