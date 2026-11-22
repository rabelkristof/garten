-- This makes it so the positions must be unique in a column/project, however it is only enforced
-- at the end of the transaction.
ALTER TABLE "Task"
ADD CONSTRAINT "Task_unique_position_per_column" UNIQUE (column_id, position) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE "Column"
ADD CONSTRAINT "Column_unique_position_per_project" UNIQUE (project_id, position) DEFERRABLE INITIALLY DEFERRED;