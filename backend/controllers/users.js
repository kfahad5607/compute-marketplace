import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import db from "../db/index.js";
import config from "../config.js";
import * as tables from "../db/schema/index.js";

const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

const generateAccessToken = async (user) => {
  try {
    const accessToken = jwt.sign(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          balance: user.balance,
        },
      },
      config.ACCESS_TOKEN_SECRET,
      {
        expiresIn: config.ACCESS_TOKEN_EXPIRY,
      }
    );

    return accessToken;
  } catch (error) {
    console.error("ERROR in generateAccessToken ", error);
    throw new Error("Something went wrong while generating access token");
  }
};

const generateRefreshToken = async (userId) => {
  try {
    const refreshToken = jwt.sign(
      {
        id: userId,
      },
      config.REFRESH_TOKEN_SECRET,
      {
        expiresIn: config.REFRESH_TOKEN_EXPIRY,
      }
    );

    return refreshToken;
  } catch (error) {
    console.error("ERROR in generateRefreshToken ", error);
    throw new Error("Something went wrong while generating refresh token");
  }
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

    res.status(201).json({
      status: "success",
      message: "You are registered successfully!",
      data: results[0],
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

    const accessToken = await generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user.id);

    res.status(200).json({
      status: "success",
      message: "Logged in successfully!",
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (err) {
    next(err);
  }
}
