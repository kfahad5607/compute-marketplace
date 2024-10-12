import config from "../config.js";
import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from "pg";

const pool = new pkg.Pool({
    connectionString: config.DB_URL,
});

const db = drizzle(pool);

export default db;