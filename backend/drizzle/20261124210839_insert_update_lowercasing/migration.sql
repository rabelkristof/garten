CREATE FUNCTION lowercase_email() RETURNS trigger AS $$
    BEGIN
        NEW.email = lower(NEW.email);
        RETURN NEW;
    END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER lowercase_email
BEFORE INSERT OR UPDATE ON "User"
FOR EACH ROW EXECUTE FUNCTION lowercase_email();

CREATE FUNCTION lowercase_name() RETURNS trigger AS $$
    BEGIN
        NEW.name = lower(NEW.name);
        RETURN NEW;
    END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER lowercase_project_name
BEFORE INSERT OR UPDATE ON "Project"
FOR EACH ROW EXECUTE FUNCTION lowercase_name();

CREATE TRIGGER lowercase_role_name
BEFORE INSERT OR UPDATE ON "Role"
FOR EACH ROW EXECUTE FUNCTION lowercase_name();

CREATE TRIGGER lowercase_column_name
BEFORE INSERT OR UPDATE ON "Column"
FOR EACH ROW EXECUTE FUNCTION lowercase_name();

CREATE TRIGGER lowercase_label_name
BEFORE INSERT OR UPDATE ON "Label"
FOR EACH ROW EXECUTE FUNCTION lowercase_name();