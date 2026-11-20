#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/84af9889792ba8ad8ae2ffeb282846bc037062eb60e7cfa25ad7d30aca146152/contract';
import endContract from '../../snapshots/84af9889792ba8ad8ae2ffeb282846bc037062eb60e7cfa25ad7d30aca146152/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  primaryKey,
  sql,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'Column',
        columns: [
          col('id', 'BIGSERIAL', { notNull: true, codecRef: { codecId: 'pg/int8@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('position', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('project_id', 'int8', { notNull: true, codecRef: { codecId: 'pg/int8@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression('position_check_c03c2ccb', sql`position >= 0`),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'Comment',
        columns: [
          col('content', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('creator_id', 'int8', { codecRef: { codecId: 'pg/int8@1' } }),
          col('id', 'BIGSERIAL', { notNull: true, codecRef: { codecId: 'pg/int8@1' } }),
          col('task_id', 'int8', { notNull: true, codecRef: { codecId: 'pg/int8@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'InviteLink',
        columns: [
          col('code', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('created_at', 'timestamptz(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 3 } },
          }),
          col('is_single_use', 'bool', { notNull: true, codecRef: { codecId: 'pg/bool@1' } }),
          col('projectId', 'int8', { notNull: true, codecRef: { codecId: 'pg/int8@1' } }),
        ],
        constraints: [primaryKey(['code'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Label',
        columns: [
          col('id', 'BIGSERIAL', { notNull: true, codecRef: { codecId: 'pg/int8@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('project_id', 'int8', { notNull: true, codecRef: { codecId: 'pg/int8@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Labeling',
        columns: [
          col('label_id', 'int8', { notNull: true, codecRef: { codecId: 'pg/int8@1' } }),
          col('task_id', 'int8', { notNull: true, codecRef: { codecId: 'pg/int8@1' } }),
        ],
        constraints: [primaryKey(['task_id', 'label_id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'PasswordResetLink',
        columns: [
          col('code', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('created_at', 'timestamptz(3)', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 3 } },
          }),
          col('userId', 'int8', { notNull: true, codecRef: { codecId: 'pg/int8@1' } }),
        ],
        constraints: [primaryKey(['code'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Project',
        columns: [
          col('default_permissions', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'BIGSERIAL', { notNull: true, codecRef: { codecId: 'pg/int8@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('owner_id', 'int8', { notNull: true, codecRef: { codecId: 'pg/int8@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'ProjectMembership',
        columns: [
          col('project_id', 'int8', { notNull: true, codecRef: { codecId: 'pg/int8@1' } }),
          col('role_id', 'int8', { codecRef: { codecId: 'pg/int8@1' } }),
          col('user_id', 'int8', { notNull: true, codecRef: { codecId: 'pg/int8@1' } }),
        ],
        constraints: [primaryKey(['project_id', 'user_id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Role',
        columns: [
          col('id', 'BIGSERIAL', { notNull: true, codecRef: { codecId: 'pg/int8@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('permissions', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('project_id', 'int8', { notNull: true, codecRef: { codecId: 'pg/int8@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Task',
        columns: [
          col('column_id', 'int8', { notNull: true, codecRef: { codecId: 'pg/int8@1' } }),
          col('creator_id', 'int8', { codecRef: { codecId: 'pg/int8@1' } }),
          col('description', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'BIGSERIAL', { notNull: true, codecRef: { codecId: 'pg/int8@1' } }),
          col('title', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'TaskAssignment',
        columns: [
          col('task_id', 'int8', { notNull: true, codecRef: { codecId: 'pg/int8@1' } }),
          col('user_id', 'int8', { notNull: true, codecRef: { codecId: 'pg/int8@1' } }),
        ],
        constraints: [primaryKey(['task_id', 'user_id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'User',
        columns: [
          col('email', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'BIGSERIAL', { notNull: true, codecRef: { codecId: 'pg/int8@1' } }),
          col('password', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('profile_picture', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('username', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'User',
        constraint: 'User_username_key',
        columns: ['username'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'User',
        constraint: 'User_email_key',
        columns: ['email'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Column',
        index: 'Column_project_id_idx_6ad92603',
        columns: ['project_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Comment',
        index: 'Comment_creator_id_idx_c8bab67a',
        columns: ['creator_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Comment',
        index: 'Comment_task_id_idx_5d5ac774',
        columns: ['task_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'InviteLink',
        index: 'InviteLink_projectId_idx_a96e4d92',
        columns: ['projectId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Label',
        index: 'Label_project_id_idx_6ad92603',
        columns: ['project_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Labeling',
        index: 'Labeling_label_id_idx_c7720d3e',
        columns: ['label_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Labeling',
        index: 'Labeling_task_id_idx_5d5ac774',
        columns: ['task_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'PasswordResetLink',
        index: 'PasswordResetLink_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Project',
        index: 'Project_owner_id_idx_ade9f347',
        columns: ['owner_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ProjectMembership',
        index: 'ProjectMembership_project_id_idx_6ad92603',
        columns: ['project_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ProjectMembership',
        index: 'ProjectMembership_role_id_idx_d9467c50',
        columns: ['role_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ProjectMembership',
        index: 'ProjectMembership_user_id_idx_6c952402',
        columns: ['user_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Role',
        index: 'Role_project_id_idx_6ad92603',
        columns: ['project_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Task',
        index: 'Task_column_id_idx_81374a1c',
        columns: ['column_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'TaskAssignment',
        index: 'TaskAssignment_task_id_idx_5d5ac774',
        columns: ['task_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'TaskAssignment',
        index: 'TaskAssignment_user_id_idx_6c952402',
        columns: ['user_id'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Column',
        foreignKey: {
          name: 'Column_project_id_fkey',
          columns: ['project_id'],
          references: { schema: 'public', table: 'Project', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Comment',
        foreignKey: {
          name: 'Comment_task_id_fkey',
          columns: ['task_id'],
          references: { schema: 'public', table: 'Task', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Comment',
        foreignKey: {
          name: 'Comment_creator_id_fkey',
          columns: ['creator_id'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'InviteLink',
        foreignKey: {
          name: 'InviteLink_projectId_fkey',
          columns: ['projectId'],
          references: { schema: 'public', table: 'Project', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Label',
        foreignKey: {
          name: 'Label_project_id_fkey',
          columns: ['project_id'],
          references: { schema: 'public', table: 'Project', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Labeling',
        foreignKey: {
          name: 'Labeling_task_id_fkey',
          columns: ['task_id'],
          references: { schema: 'public', table: 'Task', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Labeling',
        foreignKey: {
          name: 'Labeling_label_id_fkey',
          columns: ['label_id'],
          references: { schema: 'public', table: 'Label', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'PasswordResetLink',
        foreignKey: {
          name: 'PasswordResetLink_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Project',
        foreignKey: {
          name: 'Project_owner_id_fkey',
          columns: ['owner_id'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ProjectMembership',
        foreignKey: {
          name: 'ProjectMembership_project_id_fkey',
          columns: ['project_id'],
          references: { schema: 'public', table: 'Project', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ProjectMembership',
        foreignKey: {
          name: 'ProjectMembership_user_id_fkey',
          columns: ['user_id'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ProjectMembership',
        foreignKey: {
          name: 'ProjectMembership_role_id_fkey',
          columns: ['role_id'],
          references: { schema: 'public', table: 'Role', columns: ['id'] },
          onDelete: 'setNull',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Role',
        foreignKey: {
          name: 'Role_project_id_fkey',
          columns: ['project_id'],
          references: { schema: 'public', table: 'Project', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Task',
        foreignKey: {
          name: 'Task_column_id_fkey',
          columns: ['column_id'],
          references: { schema: 'public', table: 'Column', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Task',
        foreignKey: {
          name: 'Task_column_id_fkey',
          columns: ['column_id'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'TaskAssignment',
        foreignKey: {
          name: 'TaskAssignment_task_id_fkey',
          columns: ['task_id'],
          references: { schema: 'public', table: 'Task', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'TaskAssignment',
        foreignKey: {
          name: 'TaskAssignment_user_id_fkey',
          columns: ['user_id'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
