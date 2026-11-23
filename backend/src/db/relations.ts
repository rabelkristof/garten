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
      projects: r.many.projects(),
      memberships: r.many.memberships(),
    },
    projects: {
      owner: r.one.users({
        from: r.users.id,
        to: r.projects.ownerId,
      }),
      members: r.many.users({
        from: r.users.id.through(r.memberships.userId),
        to: r.projects.id.through(r.memberships.projectId),
      }),
      roles: r.many.roles({
        from: r.roles.projectId,
        to: r.projects.id,
      }),
    },
    roles: {
      project: r.one.projects(),
    },
  })
);
