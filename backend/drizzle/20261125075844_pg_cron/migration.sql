CREATE EXTENSION pg_cron;

SELECT cron.schedule(
    'delete_expired_links',
    '0 3 * * *',
    $$DELETE FROM "InviteLink" WHERE (created_at + interval '1 month') < NOW()$$
);

SELECT cron.schedule(
    'delete_expired_password_reset_codes',
    '0 3 * * *',
    $$DELETE FROM "InviteLink" WHERE (created_at + interval '10 minutes') < NOW()$$
);