CREATE TABLE `answers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`questionId` integer NOT NULL,
	`answer` integer NOT NULL,
	`date` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`questionId`) REFERENCES `questions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `questionSets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text
);
--> statement-breakpoint
CREATE TABLE `questions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`question` text NOT NULL,
	`category` text DEFAULT 'unknown' NOT NULL,
	`level` text DEFAULT 'N5' NOT NULL,
	`answers` text NOT NULL,
	`correctAnswer` integer NOT NULL,
	`questionSet` integer,
	FOREIGN KEY (`questionSet`) REFERENCES `questionSets`(`id`) ON UPDATE no action ON DELETE no action
);
