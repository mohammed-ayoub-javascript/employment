CREATE TABLE `admin` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`username` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`image` varchar(255) NOT NULL,
	CONSTRAINT `admin_id` PRIMARY KEY(`id`),
	CONSTRAINT `admin_username_unique` UNIQUE(`username`),
	CONSTRAINT `admin_email_unique` UNIQUE(`email`),
	CONSTRAINT `admin_image_unique` UNIQUE(`image`)
);
