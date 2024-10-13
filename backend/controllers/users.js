import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import db from "../db/index.js";
import config from "../config.js";
import * as tables from "../db/schema/index.js";
import { timeStrToDuration } from "../utils/index.js";
import {
  generateAccessToken,
  generateRefreshToken,
  hashPassword,
  REFRESH_TOKEN_KEY,
  verifyPassword,
} from "../utils/auth.js";

const generateTokens = async (user, res) => {
  const accessToken = await generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user.id);

  await db
    .update(tables.users)
    .set({
      refreshToken,
    })
    .where(eq(tables.users.id, user.id));

  const options = {
    httpOnly: true,
    secure: true,
    maxAge: timeStrToDuration(config.REFRESH_TOKEN_EXPIRY),
    sameSite: "Strict",
  };

  res.cookie(REFRESH_TOKEN_KEY, refreshToken, options);

  return accessToken;
};

export async function register(req, res, next) {
  try {
    const newUser = req.body;
    newUser.passwordHash = await hashPassword(newUser.password);

    const existingUser = await db
      .select({
        id: tables.users.id,
      })
      .from(tables.users)
      .where(eq(tables.users.email, newUser.email));

    if (existingUser.length > 0) {
      res.status(400);
      throw new Error(`User with email '${newUser.email}' already exists.`);
    }

    const results = await db.insert(tables.users).values(newUser).returning({
      id: tables.users.id,
      email: tables.users.email,
      name: tables.users.name,
      role: tables.users.role,
      balance: tables.users.balance,
      role: tables.users.role,
    });

    const accessToken = await generateTokens(results[0], res);

    res.status(201).json({
      status: "success",
      message: "You are registered successfully!",
      data: {
        accessToken,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const existingUser = await db
      .select({
        id: tables.users.id,
        email: tables.users.email,
        name: tables.users.name,
        role: tables.users.role,
        balance: tables.users.balance,
        passwordHash: tables.users.passwordHash,
      })
      .from(tables.users)
      .where(eq(tables.users.email, email));

    if (existingUser.length === 0) {
      res.status(401);
      throw new Error("Invalid credentials.");
    }

    const user = existingUser[0];
    const passwordsMatch = await verifyPassword(password, user.passwordHash);

    if (!passwordsMatch) {
      res.status(401);
      throw new Error(`Invalid credentials.`);
    }

    const accessToken = await generateTokens(user, res);

    res.status(200).json({
      status: "success",
      message: "Logged in successfully!",
      data: {
        accessToken,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function logout(req, res, next) {
  try {
    await db
      .update(tables.users)
      .set({
        refreshToken: null,
      })
      .where(eq(tables.users.id, req.user.id));

    res.clearCookie(REFRESH_TOKEN_KEY, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    res.status(200).json({
      status: "success",
      message: "Logged out successfully!",
    });
  } catch (err) {
    next(err);
  }
}

export async function refreshAccessToken(req, res, next) {
  try {
    const refreshToken = req.cookies[REFRESH_TOKEN_KEY];

    if (!refreshToken) {
      throw new Error("Unauthorized request.");
    }

    const decodedToken = jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET);

    const user = await db
      .select({
        id: tables.users.id,
        email: tables.users.email,
        name: tables.users.name,
        role: tables.users.role,
        balance: tables.users.balance,
        refreshToken: tables.users.refreshToken,
      })
      .from(tables.users)
      .where(eq(tables.users.id, decodedToken.id));

    if (user.length === 0) {
      throw new Error("Invalid refresh token");
    }

    if (refreshToken !== user[0].refreshToken) {
      throw new Error("Refresh token is expired or used");
    }

    const accessToken = await generateAccessToken(user[0]);

    res.status(200).json({
      status: "success",
      message: "Access token generated successfully!",
      data: {
        accessToken,
      },
    });
  } catch (err) {
    res.status(401);
    next(err);
  }
}
