import { seed } from "drizzle-seed";
import db from "./db.js";
import { relations } from "./relations.js";
import * as schema from "./schema.js";

await seed(db, schema, { count: 100, relations });
