import express from "express";
import * as bids from "../controllers/bids.js";
import { validateRequest, checkAuth } from "../middlewares/index.js";
import { NewBid } from "../validators/index.js";

const router = express.Router();

router.use(checkAuth);

router.get("/:gpuId", bids.getGPUBids);

router.post(
  "/",
  validateRequest({
    body: NewBid,
  }),
  bids.createOne
);

export default router;
