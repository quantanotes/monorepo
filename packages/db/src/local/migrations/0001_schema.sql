CREATE TYPE "public"."tag_types" AS ENUM('text', 'number', 'boolean', 'reference', 'date', 'datetime', 'duration', 'url');--> statement-breakpoint
CREATE TABLE "object_tags" (
	"space_id" varchar(12) NOT NULL,
	"object_id" varchar(12) NOT NULL,
	"tag_id" varchar(12) NOT NULL,
	"value" jsonb,
	"type" "tag_types",
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"is_new" boolean DEFAULT false NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"is_sent" boolean DEFAULT false NOT NULL,
	"is_synced" boolean GENERATED ALWAYS AS (ARRAY_LENGTH(modified_columns, 1) IS NULL AND NOT is_deleted AND NOT is_new) STORED,
	"modified_columns" text[] DEFAULT '{}',
	"backup" jsonb,
	CONSTRAINT "object_tags_object_id_tag_id_pk" PRIMARY KEY("object_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "objects" (
	"id" varchar(12) PRIMARY KEY NOT NULL,
	"space_id" varchar(12) NOT NULL,
	"parent_id" varchar(12),
	"name" text NOT NULL,
	"content" text NOT NULL,
	"view" varchar NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"embedding" vector(1536),
	"is_embedded" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"is_new" boolean DEFAULT false NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"is_sent" boolean DEFAULT false NOT NULL,
	"is_synced" boolean GENERATED ALWAYS AS (ARRAY_LENGTH(modified_columns, 1) IS NULL AND NOT is_deleted AND NOT is_new) STORED,
	"modified_columns" text[] DEFAULT '{}',
	"backup" jsonb
);
--> statement-breakpoint
CREATE TABLE "pinned" (
	"id" varchar(12) PRIMARY KEY NOT NULL,
	"space_id" varchar(12) NOT NULL,
	"object_id" varchar(12),
	"tag_id" varchar(12),
	"type" varchar NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"is_new" boolean DEFAULT false NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"is_sent" boolean DEFAULT false NOT NULL,
	"is_synced" boolean GENERATED ALWAYS AS (ARRAY_LENGTH(modified_columns, 1) IS NULL AND NOT is_deleted AND NOT is_new) STORED,
	"modified_columns" text[] DEFAULT '{}',
	"backup" jsonb,
	CONSTRAINT "pinned_objectId_unique" UNIQUE("object_id")
);
--> statement-breakpoint
CREATE TABLE "tag_tags" (
	"space_id" varchar(12) NOT NULL,
	"tag_id" varchar(12) NOT NULL,
	"parent_id" varchar(12) NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"is_new" boolean DEFAULT false NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"is_sent" boolean DEFAULT false NOT NULL,
	"is_synced" boolean GENERATED ALWAYS AS (ARRAY_LENGTH(modified_columns, 1) IS NULL AND NOT is_deleted AND NOT is_new) STORED,
	"modified_columns" text[] DEFAULT '{}',
	"backup" jsonb,
	CONSTRAINT "tag_tags_tag_id_parent_id_pk" PRIMARY KEY("tag_id","parent_id")
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" varchar(12) PRIMARY KEY NOT NULL,
	"space_id" varchar(12) NOT NULL,
	"name" text NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"color" text,
	"type" "tag_types",
	"default" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"is_new" boolean DEFAULT false NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"is_sent" boolean DEFAULT false NOT NULL,
	"is_synced" boolean GENERATED ALWAYS AS (ARRAY_LENGTH(modified_columns, 1) IS NULL AND NOT is_deleted AND NOT is_new) STORED,
	"modified_columns" text[] DEFAULT '{}',
	"backup" jsonb,
	CONSTRAINT "tags_spaceId_name_unique" UNIQUE("space_id","name")
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" varchar(12) PRIMARY KEY NOT NULL,
	"space_id" varchar(12) NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"code" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"is_new" boolean DEFAULT false NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"is_sent" boolean DEFAULT false NOT NULL,
	"is_synced" boolean GENERATED ALWAYS AS (ARRAY_LENGTH(modified_columns, 1) IS NULL AND NOT is_deleted AND NOT is_new) STORED,
	"modified_columns" text[] DEFAULT '{}',
	"backup" jsonb
);
--> statement-breakpoint
CREATE TABLE "tools" (
	"id" varchar(12) PRIMARY KEY NOT NULL,
	"space_id" varchar(12) NOT NULL,
	"name" text DEFAULT '' NOT NULL,
	"type" text NOT NULL,
	"config" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"is_new" boolean DEFAULT false NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"is_sent" boolean DEFAULT false NOT NULL,
	"is_synced" boolean GENERATED ALWAYS AS (ARRAY_LENGTH(modified_columns, 1) IS NULL AND NOT is_deleted AND NOT is_new) STORED,
	"modified_columns" text[] DEFAULT '{}',
	"backup" jsonb
);
--> statement-breakpoint
-- ALTER TABLE "object_tags" ADD CONSTRAINT "object_tags_object_id_objects_id_fk" FOREIGN KEY ("object_id") REFERENCES "public"."objects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
-- ALTER TABLE "object_tags" ADD CONSTRAINT "object_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
-- ALTER TABLE "pinned" ADD CONSTRAINT "pinned_object_id_objects_id_fk" FOREIGN KEY ("object_id") REFERENCES "public"."objects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
-- ALTER TABLE "pinned" ADD CONSTRAINT "pinned_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
-- ALTER TABLE "tag_tags" ADD CONSTRAINT "tag_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
-- ALTER TABLE "tag_tags" ADD CONSTRAINT "tag_tags_parent_id_tags_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "object_tags_is_new_index" ON "object_tags" USING btree ("is_new");--> statement-breakpoint
CREATE INDEX "object_tags_is_deleted_index" ON "object_tags" USING btree ("is_deleted");--> statement-breakpoint
CREATE INDEX "object_tags_is_synced_index" ON "object_tags" USING btree ("is_synced");--> statement-breakpoint
CREATE INDEX "objects_is_new_index" ON "objects" USING btree ("is_new");--> statement-breakpoint
CREATE INDEX "objects_is_deleted_index" ON "objects" USING btree ("is_deleted");--> statement-breakpoint
CREATE INDEX "objects_is_synced_index" ON "objects" USING btree ("is_synced");--> statement-breakpoint
CREATE INDEX "pinned_is_new_index" ON "pinned" USING btree ("is_new");--> statement-breakpoint
CREATE INDEX "pinned_is_deleted_index" ON "pinned" USING btree ("is_deleted");--> statement-breakpoint
CREATE INDEX "pinned_is_synced_index" ON "pinned" USING btree ("is_synced");--> statement-breakpoint
CREATE INDEX "tag_tags_is_new_index" ON "tag_tags" USING btree ("is_new");--> statement-breakpoint
CREATE INDEX "tag_tags_is_deleted_index" ON "tag_tags" USING btree ("is_deleted");--> statement-breakpoint
CREATE INDEX "tag_tags_is_synced_index" ON "tag_tags" USING btree ("is_synced");--> statement-breakpoint
CREATE INDEX "tags_is_new_index" ON "tags" USING btree ("is_new");--> statement-breakpoint
CREATE INDEX "tags_is_deleted_index" ON "tags" USING btree ("is_deleted");--> statement-breakpoint
CREATE INDEX "tags_is_synced_index" ON "tags" USING btree ("is_synced");--> statement-breakpoint
CREATE INDEX "tasks_is_new_index" ON "tasks" USING btree ("is_new");--> statement-breakpoint
CREATE INDEX "tasks_is_deleted_index" ON "tasks" USING btree ("is_deleted");--> statement-breakpoint
CREATE INDEX "tasks_is_synced_index" ON "tasks" USING btree ("is_synced");--> statement-breakpoint
CREATE INDEX "tools_is_new_index" ON "tools" USING btree ("is_new");--> statement-breakpoint
CREATE INDEX "tools_is_deleted_index" ON "tools" USING btree ("is_deleted");--> statement-breakpoint
CREATE INDEX "tools_is_synced_index" ON "tools" USING btree ("is_synced");