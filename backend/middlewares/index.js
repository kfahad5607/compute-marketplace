import config from "../config.js";
import jwt from "jsonwebtoken";
import { ZodError } from "zod";

export const validateRequest = (validators) => {
  return async (req, res, next) => {
    try {
      if (validators.params) {
        req.params = await validators.params.parseAsync(req.params);
      }
      if (validators.body) {
        req.body = await validators.body.parseAsync(req.body);
      }
      if (validators.query) {
        req.query = await validators.query.parseAsync(req.query);
      }

      next();
    } catch (err) {
      if (err instanceof Error) {
        if (err instanceof ZodError) res.status(400);
        next(err);
      }
    }
  };
};

export const checkAuth = async (req, res, next) => {
  try {
    const token =
      req.cookies.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new Error("Unauthorized request");
    }

    const decodedToken = jwt.verify(token, config.ACCESS_TOKEN_SECRET);

    req.user = decodedToken.user;
    next();
  } catch (err) {
    res.status(401);
    next(new Error(err?.message || "Invalid access token"));
  }
};
