CREATE TABLE "Column" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "Column_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"name" varchar NOT NULL,
	"position" integer NOT NULL,
	"project_id" bigint NOT NULL,
	CONSTRAINT "position_check" CHECK (position >= 0)
);
--> statement-breakpoint
CREATE TABLE "Comment" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "Comment_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"content" varchar NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"task_id" bigint NOT NULL,
	"creator_id" bigint
);
--> statement-breakpoint
CREATE TABLE "InviteLink" (
	"code" varchar PRIMARY KEY,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"is_single_use" boolean NOT NULL,
	"project_id" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Labeling" (
	"task_id" bigint,
	"label_id" bigint,
	CONSTRAINT "Labeling_pkey" PRIMARY KEY("task_id","label_id")
);
--> statement-breakpoint
CREATE TABLE "Label" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "Label_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"name" varchar NOT NULL,
	"project_id" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "PasswordResetLink" (
	"hash" bytea PRIMARY KEY,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"user_id" bigint NOT NULL,
	CONSTRAINT "PasswordResetLink_hash_length_check" CHECK (length("hash") = 64)
);
--> statement-breakpoint
CREATE TABLE "ProjectMembership" (
	"project_id" bigint,
	"user_id" bigint,
	"role_id" bigint,
	CONSTRAINT "ProjectMembership_pkey" PRIMARY KEY("project_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "Project" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "Project_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"name" varchar NOT NULL,
	"default_permissions" integer NOT NULL,
	"owner_id" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Role" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "Role_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"name" varchar NOT NULL,
	"permissions" integer NOT NULL,
	"project_id" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "TaskAssignment" (
	"task_id" bigint,
	"user_id" bigint,
	CONSTRAINT "TaskAssignment_pkey" PRIMARY KEY("task_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "Task" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "Task_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"title" varchar NOT NULL,
	"description" varchar,
	"position" integer NOT NULL,
	"column_id" bigint NOT NULL,
	"creator_id" bigint,
	CONSTRAINT "position_check" CHECK (position >= 0)
);
--> statement-breakpoint
CREATE TABLE "User" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "User_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"username" varchar NOT NULL,
	"email" varchar NOT NULL,
	"password" varchar NOT NULL,
	"profile_picture" varchar NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "idx_project_column_name" ON "Column" ("project_id",lower("name"));--> statement-breakpoint
CREATE INDEX "Comment_task_id_created_at_index" ON "Comment" ("task_id","created_at");--> statement-breakpoint
CREATE INDEX "Comment_creator_id_index" ON "Comment" ("creator_id");--> statement-breakpoint
CREATE INDEX "InviteLink_project_id_index" ON "InviteLink" ("project_id");--> statement-breakpoint
CREATE INDEX "Labeling_label_id_index" ON "Labeling" ("label_id");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_project_label_name" ON "Label" ("project_id",lower("name"));--> statement-breakpoint
CREATE INDEX "PasswordResetLink_user_id_index" ON "PasswordResetLink" ("user_id");--> statement-breakpoint
CREATE INDEX "ProjectMembership_user_id_index" ON "ProjectMembership" ("user_id");--> statement-breakpoint
CREATE INDEX "ProjectMembership_role_id_index" ON "ProjectMembership" ("role_id");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_owner_project_name" ON "Project" ("owner_id",lower("name"));--> statement-breakpoint
CREATE UNIQUE INDEX "idx_project_role_name" ON "Role" ("project_id",lower("name"));--> statement-breakpoint
CREATE INDEX "TaskAssignment_user_id_index" ON "TaskAssignment" ("user_id");--> statement-breakpoint
CREATE INDEX "Task_creator_id_index" ON "Task" ("creator_id");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_username" ON "User" (lower("username"));--> statement-breakpoint
CREATE UNIQUE INDEX "idx_email" ON "User" (lower("email"));--> statement-breakpoint
ALTER TABLE "Column" ADD CONSTRAINT "Column_project_id_Project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_task_id_Task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "Task"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_creator_id_User_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "User"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "InviteLink" ADD CONSTRAINT "InviteLink_project_id_Project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "Labeling" ADD CONSTRAINT "Labeling_task_id_Task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "Task"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "Labeling" ADD CONSTRAINT "Labeling_label_id_Label_id_fkey" FOREIGN KEY ("label_id") REFERENCES "Label"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "Label" ADD CONSTRAINT "Label_project_id_Project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "PasswordResetLink" ADD CONSTRAINT "PasswordResetLink_user_id_User_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "ProjectMembership" ADD CONSTRAINT "ProjectMembership_project_id_Project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "ProjectMembership" ADD CONSTRAINT "ProjectMembership_user_id_User_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "ProjectMembership" ADD CONSTRAINT "ProjectMembership_role_id_Role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "Project" ADD CONSTRAINT "Project_owner_id_User_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "Role" ADD CONSTRAINT "Role_project_id_Project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "TaskAssignment" ADD CONSTRAINT "TaskAssignment_task_id_Task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "Task"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "TaskAssignment" ADD CONSTRAINT "TaskAssignment_user_id_User_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "Task" ADD CONSTRAINT "Task_column_id_Column_id_fkey" FOREIGN KEY ("column_id") REFERENCES "Column"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "Task" ADD CONSTRAINT "Task_creator_id_User_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "User"("id") ON DELETE SET NULL;