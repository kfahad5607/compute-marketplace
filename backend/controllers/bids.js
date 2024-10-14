import { desc, eq } from "drizzle-orm";
import db from "../db/index.js";
import * as tables from "../db/schema/index.js";
import { NewBid } from "../validators/index.js";

export async function getGPUBids(req, res, next) {
  try {
    const gpuId = parseInt(req.params.gpuId);

    let query = db.select().from(tables.bids).where(eq(tables.bids.gpu, gpuId));
    const results = await query;

    res.status(200).json({
      status: "success",
      message: "Bids fetched successfully!",
      data: results,
    });
  } catch (err) {
    next(err);
  }
}

export async function createOne(req, res, next) {
  try {
    const newBid = req.body;
    newBid.bidder = req.user.id;

    const results = await db
      .insert(tables.bids)
      .values(newBid)
      .returning({ id: tables.bids.id });

    newBid.id = results[0].id;

    res.status(201).json({
      status: "success",
      message: "Bid placed successfully!",
      data: newBid,
    });
  } catch (err) {
    next(err);
  }
}

export async function placeBid(bid, user) {
  try {
    const parsedBid = await NewBid.parseAsync(bid);
    parsedBid.bidder = user.id;

    const currentTime = new Date();
    if (currentTime - parsedBid.bidTime > 2000) {
      throw new Error(`Bid is too old to be placed, please retry!`);
    }

    const currentGPU = await db.query.gpus.findFirst({
      where: eq(tables.gpus.id, bid.gpu),
      with: {
        bids: {
          orderBy: [desc(tables.bids.amount)],
          limit: 1,
        },
      },
    });

    let highestBidAmount = currentGPU.price;
    if (currentGPU.bids.length > 0) {
      highestBidAmount = currentGPU.bids[0].amount;

      if (currentGPU.bids[0].bidTime > parsedBid.bidTime) {
        throw new Error(`Bid is too old to be placed, please retry!`);
      }
    }
    // check if greater than last bid
    if (highestBidAmount >= parsedBid.amount) {
      throw new Error(`Bid amount should be higher than $${highestBidAmount}`);
    }

    // check for user balance
    const currentUser = await db.query.users.findFirst({
      where: eq(tables.users.id, user.id),
      columns: {
        id: true,
        email: true,
        name: true,
        balance: true,
      },
    });
    if (parseFloat(currentUser.balance) < parsedBid.amount) {
      throw new Error(`You do not have enough balance to place a bid.`);
    }

    // deduct user balance
    const updatedUserBalance =
      parseFloat(currentUser.balance) - parsedBid.amount;

    await db
      .update(tables.users)
      .set({ balance: updatedUserBalance })
      .where(eq(tables.users.id, currentUser.id));

    // update timestamp
    parsedBid.bidTime = new Date();

    const results = await db
      .insert(tables.bids)
      .values(parsedBid)
      .returning({ id: tables.bids.id });

    parsedBid.id = results[0].id;
    parsedBid.bidder = {
      id: currentUser.id,
      email: currentUser.email,
      name: currentUser.name,
    };

    return parsedBid;
  } catch (err) {
    console.error("ERRR ", err);
    return err;
  }
}
