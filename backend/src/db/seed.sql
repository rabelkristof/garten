-- Not written by me
-- =============================================================================================
-- Development seed data (plain SQL, PostgreSQL 13+, needs the citext extension from your schema)
--
--   psql "$DATABASE_URL" -f seed.sql
--
-- * Run it on an EMPTY, migrated database. Ids are written explicitly and the identity sequences
--   are moved past them at the end. To wipe everything first, uncomment the TRUNCATE below.
-- * Everything runs in one transaction: if anything fails, nothing is written.
-- * Deterministic: the same settings always produce the same data (no random()).
-- * Scale it by editing the numbers in the SETTINGS block. 1,000,000 users is fine.
-- =============================================================================================

BEGIN;

-- Uncomment to wipe all data and restart the id sequences.
-- TRUNCATE "Labeling",
-- "TaskAssignment",
-- "Comment",
-- "Task",
-- "ProjectMembership",
-- "InviteLink",
-- "PasswordResetLink",
-- "Label",
-- "Column",
-- "Role",
-- "Project",
-- "User" RESTART IDENTITY CASCADE;

-- ---------------------------------------------------------------------------------------------
-- SETTINGS
-- ---------------------------------------------------------------------------------------------
CREATE TEMP TABLE seed_config ON COMMIT DROP AS
SELECT *,
       array_length(column_names, 1) AS n_columns,
       array_length(role_names, 1)   AS n_roles,
       array_length(label_names, 1)  AS n_labels,
       -- About 3/4 of the users are members of each project, but never more than the cap, so the
       -- amount of work doesn't explode with the number of users.
       LEAST(CEIL(user_count * 0.75)::int, max_members_per_project, user_count) AS members_per_project
FROM (SELECT
  100000::int   AS user_count,               -- <- e.g. 1000000
  5000::int    AS project_count,
  100::int  AS max_members_per_project,
  20::int   AS max_assignees,            -- upper bound of assignees on a single task
  15::int    AS tasks_per_column,
  2::int    AS invite_links_per_project,

-- Every project gets exactly these kanban columns (in this order), roles and labels.
ARRAY[
    'To Do',
    'In Progress',
    'In Review',
    'Done'
] AS column_names,
ARRAY['Admin', 'Editor', 'Viewer'] AS role_names,
ARRAY[15, 7, 1] AS role_permissions, -- TODO: your bitmask
ARRAY[
    'bug',
    'feature',
    'docs',
    'design',
    'urgent'
] AS label_names,

-- Project i gets entry i; after the last entry the list repeats with " 2", " 3", ...

ARRAY[
    'Website Redesign',
    'Mobile App',
    'Q1 Marketing Campaign',
    'Internal Tools',
    'Customer Onboarding',
    'Data Pipeline',
    'Office Move',
    'Hiring Plan'
] AS project_names,
ARRAY[
    'Ashish',
    'Mayan',
    'Hanaa',
    'Trampus',
    'Samhita',
    'Otho',
    'Bethaney',
    'Renzo',
    'Mira',
    'Tobias',
    'Lena',
    'Kofi',
    'Yuki',
    'Sofia',
    'Dmitri',
    'Amara',
    'Liam',
    'Noor',
    'Mateo',
    'Ingrid',
    'Chen',
    'Priya',
    'Omar',
    'Hannah',
    'Felix',
    'Zainab',
    'Lucas',
    'Elif',
    'Jonas',
    'Mei'
] AS first_names,
ARRAY[
    'gmail.com',
    'yahoo.com',
    'outlook.com',
    'proton.me',
    'example.org'
] AS email_domains,

-- Not a real hash. Replace with one your auth code can verify if you want to log in as them.


'$seeded$not-a-real-hash'::text AS password_hash,

  ARRAY['Fix login redirect loop', 'Write onboarding copy', 'Set up CI pipeline',
        'Design empty states', 'Audit third-party dependencies', 'Add dark mode',
        'Investigate slow dashboard query', 'Draft release notes', 'Update privacy policy',
        'Refactor notification settings', 'Prepare sprint demo', 'Review accessibility report',
        'Migrate images to CDN', 'Add CSV export', 'Triage support backlog',
        'Plan user interviews'] AS task_titles,
  ARRAY['Needs a short write-up before we start.', 'Blocked until the design is signed off.',
        'See the linked thread for context.', 'Should be a small change, but test on mobile.',
        'Check with the team before merging.', 'Part of the larger cleanup we planned.',
        'Customers have asked for this twice already.',
        'Low priority, pick it up when there is time.'] AS task_sentences,
  ARRAY['Looks good to me.', 'Can we split this into two tasks?', 'I will pick this up tomorrow.',
        'Added a few notes in the description.', 'Blocked on the API change, see above.',
        'Reproduced it locally, working on a fix.', 'Shipped to staging, please have a look.',
        'Not sure this is still needed, thoughts?', 'Updated the estimate after talking to Lena.',
        'Thanks, merging now.', 'Can someone review this today?',
        'Moving this to the next sprint.'] AS comment_texts
) s;

-- Cheap deterministic "random" numbers: hash of a text key.
CREATE FUNCTION pg_temp.seed_hash(key text) RETURNS bigint
  LANGUAGE sql IMMUTABLE AS $$ SELECT ('x' || substr(md5(key), 1, 15))::bit(60)::bigint $$;
-- ... and the same as a fraction in [0, 1).
CREATE FUNCTION pg_temp.seed_frac(key text) RETURNS float8
  LANGUAGE sql IMMUTABLE AS $$ SELECT pg_temp.seed_hash(key) / 1152921504606846976.0 $$;

-- Per-project facts shared by several steps below:
--   owner_id    the project's owner (picked independently of membership)
--   start_user  members are the `members_per_project` users starting here (wrapping around),
--               i.e. member k is user 1 + (start_user + k) % user_count
CREATE TEMP TABLE seed_project ON
COMMIT
DROP AS
SELECT
    p AS id,
    1 + (
        pg_temp.seed_hash ('owner:' || p) % c.user_count
    )::int AS owner_id,
    (
        pg_temp.seed_hash ('members:' || p) % c.user_count
    )::int AS start_user
FROM seed_config c, generate_series(1, c.project_count) p;

-- ---------------------------------------------------------------------------------------------
-- Users
-- ---------------------------------------------------------------------------------------------
INSERT INTO
    "User" (
        id,
        username,
        email,
        password,
        profile_picture
    ) OVERRIDING SYSTEM VALUE
SELECT n, lower(fn) || '_' || n, -- the number makes it unique
    lower(fn) || '.' || n || '@' || c.email_domains[
        1 + pg_temp.seed_hash ('dom:' || n) % array_length(c.email_domains, 1)
    ], c.password_hash, '/avatars/default-' || (1 + n % 6) || '.png'
FROM seed_config c
    CROSS JOIN LATERAL generate_series(1, c.user_count) n
    CROSS JOIN LATERAL (
        SELECT c.first_names[
                1 + pg_temp.seed_hash ('fn:' || n) % array_length(c.first_names, 1)
            ] AS fn
    ) f;

-- ---------------------------------------------------------------------------------------------
-- Projects, roles, columns, labels
-- ---------------------------------------------------------------------------------------------
INSERT INTO
    "Project" (
        id,
        name,
        default_permissions,
        owner_id
    ) OVERRIDING SYSTEM VALUE
SELECT
    sp.id,
    c.project_names[
        (sp.id - 1) % array_length(c.project_names, 1) + 1
    ] || CASE
        WHEN sp.id > array_length(c.project_names, 1) THEN ' ' || (
            (sp.id - 1) / array_length(c.project_names, 1) + 1
        )
        ELSE ''
    END,
    c.role_permissions[
        1 + pg_temp.seed_hash ('dp:' || sp.id) % c.n_roles
    ],
    sp.owner_id
FROM seed_project sp
    CROSS JOIN seed_config c;

INSERT INTO
    "Role" (
        id,
        name,
        permissions,
        project_id
    ) OVERRIDING SYSTEM VALUE
SELECT (sp.id - 1) * c.n_roles + k, c.role_names[k], c.role_permissions[k], sp.id
FROM
    seed_project sp
    CROSS JOIN seed_config c
    CROSS JOIN LATERAL generate_series(1, c.n_roles) k;

INSERT INTO
    "Column" (
        id,
        name,
        position,
        project_id
    ) OVERRIDING SYSTEM VALUE
SELECT (sp.id - 1) * c.n_columns + k, c.column_names[k], k - 1, sp.id
FROM
    seed_project sp
    CROSS JOIN seed_config c
    CROSS JOIN LATERAL generate_series(1, c.n_columns) k;

INSERT INTO
    "Label" (id, name, project_id) OVERRIDING SYSTEM VALUE
SELECT (sp.id - 1) * c.n_labels + k, c.label_names[k], sp.id
FROM
    seed_project sp
    CROSS JOIN seed_config c
    CROSS JOIN LATERAL generate_series(1, c.n_labels) k;

-- ---------------------------------------------------------------------------------------------
-- Memberships (each member gets one of the project's roles) and invite links
-- ---------------------------------------------------------------------------------------------
INSERT INTO
    "ProjectMembership" (project_id, user_id, role_id)
SELECT sp.id, 1 + (sp.start_user + k) % c.user_count, (sp.id - 1) * c.n_roles + 1 + pg_temp.seed_hash ('mr:' || sp.id || ':' || k) % c.n_roles
FROM
    seed_project sp
    CROSS JOIN seed_config c
    CROSS JOIN LATERAL generate_series(0, c.members_per_project - 1) k;

INSERT INTO
    "InviteLink" (
        code,
        created_at,
        is_single_use,
        project_id
    )
SELECT md5(
        'invite:' || sp.id || ':' || k
    )::uuid::text, timestamptz '2026-01-01' + pg_temp.seed_frac ('il:' || sp.id || ':' || k) * 327 * interval '1 day', pg_temp.seed_hash ('is:' || sp.id || ':' || k) % 2 = 0, sp.id
FROM
    seed_project sp
    CROSS JOIN seed_config c
    CROSS JOIN LATERAL generate_series(1, c.invite_links_per_project) k
ORDER BY sp.id, k;

-- ---------------------------------------------------------------------------------------------
-- Tasks: every column gets `tasks_per_column` tasks, positions 0..n-1, created by a project member
-- ---------------------------------------------------------------------------------------------
INSERT INTO
    "Task" (
        id,
        title,
        description,
        position,
        column_id,
        creator_id
    ) OVERRIDING SYSTEM VALUE
SELECT t.id, c.task_titles[
        1 + pg_temp.seed_hash ('tt:' || t.id) % array_length(c.task_titles, 1)
    ], c.task_sentences[
        1 + pg_temp.seed_hash ('d1:' || t.id) % array_length(c.task_sentences, 1)
    ] || ' ' || c.task_sentences[
        1 + pg_temp.seed_hash ('d2:' || t.id) % array_length(c.task_sentences, 1)
    ], j - 1, col.id, 1 + (
        sp.start_user + pg_temp.seed_hash ('tc:' || t.id) % c.members_per_project
    ) % c.user_count
FROM
    seed_config c
    JOIN "Column" col ON true
    JOIN seed_project sp ON sp.id = col.project_id
    CROSS JOIN LATERAL generate_series(1, c.tasks_per_column) j
    CROSS JOIN LATERAL (
        SELECT (col.id - 1) * c.tasks_per_column + j AS id
    ) t;

-- ---------------------------------------------------------------------------------------------
-- Comments: 1-5 per task, written by a member of the task's project
-- ---------------------------------------------------------------------------------------------
INSERT INTO
    "Comment" (
        content,
        created_at,
        task_id,
        creator_id
    )
SELECT c.comment_texts[
        1 + pg_temp.seed_hash ('cc:' || t.id || ':' || i) % array_length(c.comment_texts, 1)
    ], timestamptz '2026-01-01' + pg_temp.seed_frac ('ct:' || t.id || ':' || i) * 327 * interval '1 day', t.id, 1 + (
        sp.start_user + pg_temp.seed_hash ('cu:' || t.id || ':' || i) % c.members_per_project
    ) % c.user_count
FROM
    seed_config c
    JOIN "Task" t ON true
    JOIN "Column" col ON col.id = t.column_id
    JOIN seed_project sp ON sp.id = col.project_id
    CROSS JOIN LATERAL (
        SELECT pg_temp.seed_frac ('cn:' || t.id) AS f, pg_temp.seed_hash ('cn2:' || t.id) % 2 AS h
    ) r
    CROSS JOIN LATERAL generate_series(
        1,
        CASE
            WHEN r.f < 0.4 THEN 1
            WHEN r.f < 0.8 THEN 2 + r.h
            ELSE 4 + r.h
        END
    ) i
ORDER BY t.id, i;

-- ---------------------------------------------------------------------------------------------
-- Assignees: 0..min(max_assignees, members) per task, skewed towards few, all project members.
-- (Distinct members: n consecutive slots out of the member window, starting at a random slot.)
-- ---------------------------------------------------------------------------------------------
INSERT INTO
    "TaskAssignment" (task_id, user_id)
SELECT t.id, 1 + (
        sp.start_user + (x.s + i) % c.members_per_project
    ) % c.user_count
FROM
    seed_config c
    JOIN "Task" t ON true
    JOIN "Column" col ON col.id = t.column_id
    JOIN seed_project sp ON sp.id = col.project_id
    CROSS JOIN LATERAL (
        SELECT floor(
                (
                    LEAST(
                        c.max_assignees, c.members_per_project
                    ) + 1
                ) * power(
                    pg_temp.seed_frac ('as:' || t.id), 2
                )
            )::int AS n, (
                pg_temp.seed_hash ('ao:' || t.id) % c.members_per_project
            )::int AS s
    ) x
    CROSS JOIN LATERAL generate_series(0, x.n - 1) i;

-- ---------------------------------------------------------------------------------------------
-- Labels: 0-2 per task, from the task's own project
-- ---------------------------------------------------------------------------------------------
INSERT INTO
    "Labeling" (task_id, label_id)
SELECT t.id, (sp.id - 1) * c.n_labels + 1 + (x.s + i) % c.n_labels
FROM
    seed_config c
    JOIN "Task" t ON true
    JOIN "Column" col ON col.id = t.column_id
    JOIN seed_project sp ON sp.id = col.project_id
    CROSS JOIN LATERAL (
        SELECT LEAST((t.id + 1) % 3, c.n_labels)::int AS n, (
                pg_temp.seed_hash ('lo:' || t.id) % c.n_labels
            )::int AS s
    ) x
    CROSS JOIN LATERAL generate_series(0, x.n - 1) i;

-- ---------------------------------------------------------------------------------------------
-- Move the identity sequences past the ids written above, so the app's own inserts keep working.
-- ---------------------------------------------------------------------------------------------
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['User', 'Project', 'Role', 'Column', 'Label', 'Task'] LOOP
    EXECUTE format(
      'SELECT setval(pg_get_serial_sequence(%L, ''id''), COALESCE(max(id), 1), max(id) IS NOT NULL) FROM %I',
      quote_ident(t), t);
  END LOOP;
END $$;

DROP FUNCTION pg_temp.seed_frac (text);

DROP FUNCTION pg_temp.seed_hash (text);

COMMIT;