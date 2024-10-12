import config from "./config.js";
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './db/schema/index.js',
  dialect: 'postgresql',
  dbCredentials: {
    url: config.DB_URL,
  },
});