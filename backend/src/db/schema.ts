import { sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  check,
  customType,
  index,
  integer,
  primaryKey,
  snakeCase,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const usersTable = snakeCase.table(
  "User",
  {
    id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
    username: varchar().notNull(),
    email: varchar().notNull(),
    password: varchar().notNull(),
    profilePicture: varchar().notNull(),
  },
  (t) => [
    uniqueIndex("idx_username").on(sql`lower(${t.username})`),
    uniqueIndex("idx_email").on(sql`lower(${t.email})`),
  ]
);

export const projectsTable = snakeCase.table(
  "Project",
  {
    id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
    name: varchar().notNull(),
    defaultPermissions: integer().notNull(),

    ownerId: bigint({ mode: "number" })
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
  },
  // A user can't have two projects with the same name.
  // This also gives us an index on ownerId due to how postgres handles multicolumn indexes
  (t) => [
    uniqueIndex("idx_owner_project_name").on(t.ownerId, sql`lower(${t.name})`),
  ]
);

export const rolesTable = snakeCase.table(
  "Role",
  {
    id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
    name: varchar().notNull(),
    permissions: integer().notNull(),

    projectId: bigint({ mode: "number" })
      .notNull()
      .references(() => projectsTable.id, { onDelete: "cascade" }),
  },
  // A project can't have two roles with the same name.
  (t) => [
    uniqueIndex("idx_project_role_name").on(t.projectId, sql`lower(${t.name})`),
  ]
);

export const columnsTable = snakeCase.table(
  "Column",
  {
    id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
    name: varchar().notNull(),
    position: integer().notNull(),

    projectId: bigint({ mode: "number" })
      .notNull()
      .references(() => projectsTable.id, { onDelete: "cascade" }),
  },
  (t) => [
    check("position_check", sql`position >= 0`),
    // A project can't have two columns with the same name.
    uniqueIndex("idx_project_column_name").on(
      t.projectId,
      sql`lower(${t.name})`
    ),
  ]
);

export const labelsTable = snakeCase.table(
  "Label",
  {
    id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
    name: varchar().notNull(),

    projectId: bigint({ mode: "number" })
      .notNull()
      .references(() => projectsTable.id, { onDelete: "cascade" }),
  },
  // A project can't have two labels with the same name.
  (t) => [
    uniqueIndex("idx_project_label_name").on(
      t.projectId,
      sql`lower(${t.name})`
    ),
  ]
);

export const tasksTable = snakeCase.table(
  "Task",
  {
    id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
    title: varchar().notNull(),
    description: varchar(),
    position: integer().notNull(),

    columnId: bigint({ mode: "number" })
      .notNull()
      .references(() => columnsTable.id, { onDelete: "cascade" }),
    creatorId: bigint({ mode: "number" }).references(() => usersTable.id, {
      onDelete: "set null",
    }),
  },
  // No index on columnId, since the UNIQUE constraint on (column_id, position) already give us one.
  // The constraint is defined in drizzle/20261122205340_unique_positions/migration.sql
  (t) => [check("position_check", sql`position >= 0`), index().on(t.creatorId)]
);

export const commentsTable = snakeCase.table(
  "Comment",
  {
    id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
    content: varchar().notNull(),
    createdAt: timestamp({ withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),

    taskId: bigint({ mode: "number" })
      .notNull()
      .references(() => tasksTable.id, { onDelete: "cascade" }),
    creatorId: bigint({ mode: "number" }).references(() => usersTable.id, {
      onDelete: "set null",
    }),
  },
  (t) => [index().on(t.taskId, t.createdAt), index().on(t.creatorId)]
);

export const inviteLinkTable = snakeCase.table(
  "InviteLink",
  {
    code: varchar().primaryKey(),
    createdAt: timestamp({ withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
    isSingleUse: boolean().notNull(),

    projectId: bigint({ mode: "number" })
      .notNull()
      .references(() => projectsTable.id, { onDelete: "cascade" }),
  },
  (t) => [index().on(t.projectId)]
);

// Byte array type for simple hashes
const bytea = customType<{ data: Buffer }>({
  dataType() {
    return "bytea";
  },
});

export const passwordResetLinkTable = snakeCase.table(
  "PasswordResetLink",
  {
    hash: bytea().primaryKey(),
    createdAt: timestamp({ withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),

    userId: bigint({ mode: "number" })
      .notNull()
      .references(() => usersTable.id, {
        onDelete: "cascade",
      }),
  },
  (t) => [
    check("PasswordResetLink_hash_length_check", sql`length(${t.hash}) = 64`),
    index().on(t.userId),
  ]
);

export const taskAssignmentsTable = snakeCase.table(
  "TaskAssignment",
  {
    taskId: bigint({ mode: "number" })
      .notNull()
      .references(() => tasksTable.id, { onDelete: "cascade" }),
    userId: bigint({ mode: "number" })
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.taskId, t.userId] }), index().on(t.userId)]
);

export const projectMembershipsTable = snakeCase.table(
  "ProjectMembership",
  {
    projectId: bigint({ mode: "number" })
      .notNull()
      .references(() => projectsTable.id, { onDelete: "cascade" }),
    userId: bigint({ mode: "number" })
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    roleId: bigint({ mode: "number" }).references(() => rolesTable.id, {
      onDelete: "set null",
    }),
  },
  (t) => [
    primaryKey({ columns: [t.projectId, t.userId] }),
    index().on(t.userId),
    index().on(t.roleId),
  ]
);

export const labelingsTable = snakeCase.table(
  "Labeling",
  {
    taskId: bigint({ mode: "number" })
      .notNull()
      .references(() => tasksTable.id, { onDelete: "cascade" }),
    labelId: bigint({ mode: "number" })
      .notNull()
      .references(() => labelsTable.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.taskId, t.labelId] }), index().on(t.labelId)]
);
