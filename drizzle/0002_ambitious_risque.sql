ALTER TABLE questions ADD `category` text DEFAULT 'unknown' NOT NULL;--> statement-breakpoint
ALTER TABLE questions ADD `level` text DEFAULT 'N5' NOT NULL;