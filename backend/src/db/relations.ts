import { defineRelations } from "drizzle-orm";
import {
  columnsTable,
  commentsTable,
  inviteLinkTable,
  labelingsTable,
  labelsTable,
  passwordResetLinkTable,
  projectMembershipsTable,
  projectsTable,
  rolesTable,
  taskAssignmentsTable,
  tasksTable,
  usersTable,
} from "./schema.js";

export const relations = defineRelations(
  {
    users: usersTable,
    projects: projectsTable,
    roles: rolesTable,
    columns: columnsTable,
    labels: labelsTable,
    tasks: tasksTable,
    comments: commentsTable,
    inviteLinks: inviteLinkTable,
    passwordResetLinks: passwordResetLinkTable,
    assignments: taskAssignmentsTable,
    memberships: projectMembershipsTable,
    labelings: labelingsTable,
  },
  (r) => ({
    users: {
      projects: r.many.projects({ alias: "owner" }),
      memberships: r.many.memberships({
        from: r.users.id,
        to: r.memberships.userId,
      }),
    },
    projects: {
      owner: r.one.users({
        from: r.projects.ownerId,
        to: r.users.id,
        alias: "owner",
      }),
      members: r.many.users({
        from: r.projects.id.through(r.memberships.projectId),
        to: r.users.id.through(r.memberships.userId),
        alias: "members",
      }),
      roles: r.many.roles({
        from: r.projects.id,
        to: r.roles.projectId,
      }),
      columns: r.many.columns({
        from: r.projects.id,
        to: r.columns.projectId,
      }),
      labels: r.many.labels({
        from: r.projects.id,
        to: r.labels.projectId,
      }),
    },
    columns: {
      tasks: r.many.tasks({
        from: r.columns.id,
        to: r.tasks.columnId,
      }),
    },
    tasks: {
      creator: r.one.users({
        from: r.tasks.creatorId,
        to: r.users.id,
      }),
      comments: r.many.comments({
        from: r.tasks.id,
        to: r.comments.taskId,
      }),
      assignees: r.many.users({
        from: r.tasks.id.through(r.assignments.taskId),
        to: r.users.id.through(r.assignments.userId),
      }),
    },
    comments: {
      creator: r.one.users({
        from: r.comments.creatorId,
        to: r.users.id,
      }),
    },
    inviteLinks: {
      project: r.one.projects({
        from: r.inviteLinks.projectId,
        to: r.projects.id,
      }),
    },
    passwordResetLinks: {
      user: r.one.users({
        from: r.passwordResetLinks.userId,
        to: r.users.id,
      }),
    },
    memberships: {
      project: r.one.projects({
        from: r.memberships.projectId,
        to: r.projects.id,
      }),
      role: r.one.roles({
        from: r.memberships.roleId,
        to: r.roles.id,
      }),
    },
  }),
);
