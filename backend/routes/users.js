import express from "express";
import * as users from "../controllers/users.js";
import { validateRequest, checkAuth } from "../middlewares/index.js";
import { NewUser, UserCreds } from "../validators/index.js";

const router = express.Router();

router.post(
  "/register",
  validateRequest({
    body: NewUser,
  }),
  users.register
);

router.post(
  "/login",
  validateRequest({
    body: UserCreds,
  }),
  users.login
);

router.post("/logout", checkAuth, users.logout);

router.post("/refresh-token", users.refreshAccessToken);

export default router;
