import { eq } from "drizzle-orm";
import db from "../db/index.js";
import * as tables from "../db/schema/index.js";

export async function getAll(req, res, next) {
  try {
    const results = await db.select().from(tables.gpus);

    res.status(200).json({
      status: "success",
      message: "GPUs fetched successfully!",
      data: results,
    });
  } catch (err) {
    next(err);
  }
}

export async function createOne(req, res, next) {
  try {
    const newGpu = req.body;
    newGpu.seller = req.user.id;

    const results = await db
      .insert(tables.gpus)
      .values(newGpu)
      .returning({ id: tables.gpus.id });

    newGpu.id = results[0].id;
    delete newGpu.seller;

    res.status(201).json({
      status: "success",
      message: "GPU created successfully!",
      data: newGpu,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateOne(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const gpu = req.body;

    const results = await db
      .update(tables.gpus)
      .set(gpu)
      .where(eq(tables.gpus.id, id))
      .returning();

    if (results.length === 0) {
      res.status(404);
      throw new Error(`GPU with id '${id}' not found.`);
    }

    res.status(200).json({
      status: "success",
      message: "GPU updated successfully!",
      data: results[0],
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteOne(req, res, next) {
  try {
    const id = parseInt(req.params.id);

    await db.delete(tables.gpus).where(eq(tables.gpus.id, id));

    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
