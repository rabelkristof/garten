import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { relations } from "./relations.js";

const db = drizzle({ connection: process.env.DATABASE_URL!, relations });

// db.query.projects.findFirst({
//   where: { id: 1 },
//   with: {
//     columns: {
//       with: {
//         tasks: { with: { creator: true, assignees: true, labels: true } },
//       },
//     },
//   },
// });

export default db;
