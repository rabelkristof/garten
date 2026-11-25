CREATE FUNCTION lowercase_email() RETURNS trigger AS $$
    BEGIN
        NEW.email = lower(NEW.email);
        RETURN NEW;
    END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER lowercase_email
BEFORE INSERT OR UPDATE ON "User"
FOR EACH ROW EXECUTE FUNCTION lowercase_email();