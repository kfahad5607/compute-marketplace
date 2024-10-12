import { relations } from "drizzle-orm";
import {
  bigserial,
  bigint,
  decimal,
  pgTable,
  varchar,
  text,
  boolean,
  pgEnum,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { USER_ROLES, GPU_STATES } from "../../constants.js";

export const gpuStatusEnum = pgEnum("gpuStatus", GPU_STATES);
export const userRolesEnum = pgEnum("userRoles", USER_ROLES);

export const users = pgTable("users", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  email: varchar("email", { length: 100 }).unique().notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  balance: decimal("balance", { precision: 15, scale: 2 }).default(0.0),
  role: userRolesEnum("role").default(USER_ROLES[1]).notNull(),
  passwordHash: text("password_hash").notNull(),
  refreshToken: text("refresh_token"),
  createdAt: timestamp("created_at", {
    mode: "date",
    precision: 3,
    withTimezone: true,
  }).defaultNow(),
});

export const gpus = pgTable("gpus", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description").notNull(),
  imageUrl: varchar("image_url", { length: 255 }),
  model: varchar("model", { length: 100 }).notNull(),
  brand: varchar("brand", { length: 100 }).notNull(),

  price: decimal("price", { precision: 10, scale: 2 }).default(1.0),
  status: gpuStatusEnum("gpu_status").notNull(),
  seller: bigint("seller", { mode: "number" })
    .references(() => users.id)
    .notNull(),
  // features:
  // auctionStartAt: timestamp('auction_start_at', { mode: "date", precision: 3, withTimezone: true, }),
  // auctionEndAt: timestamp('auction_end_at', { mode: "date", precision: 3, withTimezone: true, }),
  createdAt: timestamp("created_at", {
    mode: "date",
    precision: 3,
    withTimezone: true,
  }).defaultNow(),
  updatedAt: timestamp("updated_at", {
    mode: "date",
    precision: 3,
    withTimezone: true,
  }).$default(() => new Date()),
});

export const bids = pgTable(
  "bids",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    bidder: bigint("bidder", { mode: "number" })
      .references(() => users.id)
      .notNull(),
    gpu: bigint("gpu", { mode: "number" })
      .references(() => gpus.id)
      .notNull(),
    amount: decimal("amount", { precision: 10, scale: 2 }).default(1.0),
    isWinning: boolean("is_winning").default(false),
    bidTime: timestamp("created_at", {
      mode: "date",
      precision: 3,
      withTimezone: true,
    }).defaultNow(),
  },
  (t) => ({
    uniqueBidPerUser: unique("unique_bid_per_user").on(t.bidder, t.gpu),
  })
);

export const gpusRelations = relations(gpus, ({ one, many }) => ({
  seller: one(users, {
    fields: [gpus.seller],
    references: [users.id],
  }),
  bids: many(bids),
}));

export const usersRelations = relations(users, ({ many }) => ({
  gpus: many(gpus),
  bids: many(bids),
}));

export const bidsRelations = relations(bids, ({ one }) => ({
  bidder: one(users, {
    fields: [bids.bidder],
    references: [users.id],
  }),
  gpu: one(gpus, {
    fields: [bids.gpu],
    references: [gpus.id],
  }),
}));
