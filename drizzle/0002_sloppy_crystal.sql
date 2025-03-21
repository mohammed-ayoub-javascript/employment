ALTER TABLE `orders` DROP FOREIGN KEY `orders_user_id_admin_id_fk`;
--> statement-breakpoint
ALTER TABLE `orders` DROP COLUMN `user_id`;