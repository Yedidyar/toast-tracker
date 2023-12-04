CREATE TABLE `Account` (
	`id` varchar(191) NOT NULL,
	`userId` varchar(191) NOT NULL,
	`type` varchar(191) NOT NULL,
	`provider` varchar(191) NOT NULL,
	`providerAccountId` varchar(191) NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` int,
	`token_type` varchar(191),
	`scope` varchar(191),
	`id_token` text,
	`session_state` varchar(191),
	CONSTRAINT `Account_id_pk` PRIMARY KEY(`id`),
	CONSTRAINT `Account_provider_providerAccountId_key` UNIQUE(`provider`,`providerAccountId`)
);
--> statement-breakpoint
CREATE TABLE `Criminal` (
	`id` varchar(191) NOT NULL,
	`type` enum('REGULAR','PERSONA_NON_GRATA') NOT NULL,
	`userId` varchar(191) NOT NULL,
	CONSTRAINT `Criminal_id_pk` PRIMARY KEY(`id`),
	CONSTRAINT `Criminal_userId_key` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `Occasion` (
	`id` varchar(191) NOT NULL,
	`name` varchar(191) NOT NULL,
	CONSTRAINT `Occasion_id_pk` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Session` (
	`id` varchar(191) NOT NULL,
	`sessionToken` varchar(191) NOT NULL,
	`userId` varchar(191) NOT NULL,
	`expires` datetime(3) NOT NULL,
	CONSTRAINT `Session_id_pk` PRIMARY KEY(`id`),
	CONSTRAINT `Session_sessionToken_key` UNIQUE(`sessionToken`)
);
--> statement-breakpoint
CREATE TABLE `Toast` (
	`id` varchar(191) NOT NULL,
	`userId` varchar(191) NOT NULL,
	`occasionId` varchar(191) NOT NULL,
	`dateToBeDone` datetime(3) NOT NULL,
	`wasDone` tinyint NOT NULL DEFAULT 0,
	`createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `Toast_id_pk` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `User` (
	`id` varchar(191) NOT NULL,
	`name` varchar(191) NOT NULL,
	`email` varchar(191),
	`emailVerified` datetime(3),
	`image` varchar(191),
	`role` enum('USER','ADMIN') NOT NULL DEFAULT 'USER',
	CONSTRAINT `User_id_pk` PRIMARY KEY(`id`),
	CONSTRAINT `User_email_key` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `VerificationToken` (
	`identifier` varchar(191) NOT NULL,
	`token` varchar(191) NOT NULL,
	`expires` datetime(3) NOT NULL,
	CONSTRAINT `VerificationToken_identifier_token_key` UNIQUE(`identifier`,`token`),
	CONSTRAINT `VerificationToken_token_key` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE INDEX `Account_userId_idx` ON `Account` (`userId`);--> statement-breakpoint
CREATE INDEX `Session_userId_idx` ON `Session` (`userId`);--> statement-breakpoint
CREATE INDEX `Toast_occasionId_idx` ON `Toast` (`occasionId`);--> statement-breakpoint
CREATE INDEX `Toast_userId_idx` ON `Toast` (`userId`);