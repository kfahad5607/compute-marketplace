import config from "../config.js";
import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from "pg";
import * as schema from "./schema/index.js";

const pool = new pkg.Pool({
    connectionString: config.DB_URL,
});

const db = drizzle(pool, {
  schema,
});

export default db;