import express from "express";
import * as gpus from "../controllers/gpus.js";
import { validateRequest } from "../middlewares/index.js";
import {
  getValidationSchema,
  DatabaseIntIdParam,
  NewGPU,
  NewGPUOptional,
} from "../validators/index.js";

const router = express.Router();

router.get("/", gpus.getAll);

router.post(
  "/",
  validateRequest({
    body: NewGPU,
  }),
  gpus.createOne
);

router.patch(
  "/:id",
  validateRequest({
    params: getValidationSchema({
      id: DatabaseIntIdParam,
    }),
    body: NewGPUOptional,
  }),
  gpus.updateOne
);

router.delete(
  "/:id",
  validateRequest({
    params: getValidationSchema({
      id: DatabaseIntIdParam,
    }),
  }),
  gpus.deleteOne
);

export default router;
