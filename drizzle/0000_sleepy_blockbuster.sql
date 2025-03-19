CREATE TABLE `category` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `category_id` PRIMARY KEY(`id`),
	CONSTRAINT `category_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `discount` (
	`id` int AUTO_INCREMENT NOT NULL,
	`percentage` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `discount_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` varchar(1000) NOT NULL,
	`images` json NOT NULL,
	`category_id` int NOT NULL,
	`discount_id` int,
	`price` varchar(255) NOT NULL,
	`number` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`),
	CONSTRAINT `products_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `admin` (
	`id` int AUTO_INCREMENT NOT NULL,
	`username` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`image` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `admin_id` PRIMARY KEY(`id`),
	CONSTRAINT `admin_username_unique` UNIQUE(`username`),
	CONSTRAINT `admin_email_unique` UNIQUE(`email`),
	CONSTRAINT `admin_image_unique` UNIQUE(`image`)
);
--> statement-breakpoint
ALTER TABLE `products` ADD CONSTRAINT `products_category_id_category_id_fk` FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `products` ADD CONSTRAINT `products_discount_id_discount_id_fk` FOREIGN KEY (`discount_id`) REFERENCES `discount`(`id`) ON DELETE set null ON UPDATE no action;