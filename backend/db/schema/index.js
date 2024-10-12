import { bigint } from "drizzle-orm/mysql-core";
import { bigserial, decimal, pgTable, varchar, text, boolean } from "drizzle-orm/pg-core";

const GPU_STATES = [
    "open",
    "sold",
    "unsold",
];

const USER_ROLES = [
    "admin",
    "buyer",
];

export const gpuStatusEnum = pgEnum("gpuStatus", GPU_STATES);
export const userRolesEnum = pgEnum("userRoles", USER_ROLES);

export const usersTable = pgTable("users", {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    email: varchar("email", { length: 100 }).unique().notNull(),
    name: varchar("name", { length: 100 }).unique().notNull(),
    balance: decimal("balance", { precision: 15, scale: 2 }).default(0.00),
    role: userRolesEnum.default(USER_ROLES[1]).notNull(),
    createdAt: timestamp('created_at', { mode: "date", precision: 3, withTimezone: true, }).defaultNow(),
});

export const gpusTable = pgTable("gpus", {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    title: varchar("title", { length: 200 }).notNull(),
    description: text("description").notNull(),
    imageUrl: varchar("image_url", { length: 255 }),
    model: varchar("model", { length: 100 }).notNull(),
    brand: varchar("brand", { length: 100 }).notNull(),

    price: decimal("price", { precision: 10, scale: 2 }).default(1.00),
    status: gpuStatusEnum('gpu_status').notNull(),
    seller: bigint("seller").references(() => usersTable.id),
    // features: 
    // auctionStartAt: timestamp('auction_start_at', { mode: "date", precision: 3, withTimezone: true, }),
    // auctionEndAt: timestamp('auction_end_at', { mode: "date", precision: 3, withTimezone: true, }),
    createdAt: timestamp('created_at', { mode: "date", precision: 3, withTimezone: true, }).defaultNow(),
    updatedAt: timestamp('updated_at', { mode: "date", precision: 3, withTimezone: true, }).$default(() => new Date())
});

export const bidsTable = pgTable("bids", {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    bidder: bigint("bidder").references(() => usersTable.id),
    gpu: bigint("gpu").references(() => gpusTable.id),
    amount: decimal("amount", { precision: 10, scale: 2 }).default(1.00),
    isWinning: boolean("is_winning").default(false),
    bidTime: timestamp('created_at', { mode: "date", precision: 3, withTimezone: true, }).defaultNow(),
}, (t) => ({
    unq: unique("unique_bid_per_user").on(t.bidder, t.gpu),
}));