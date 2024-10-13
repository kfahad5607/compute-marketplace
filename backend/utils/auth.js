import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import config from "../config.js";

export const REFRESH_TOKEN_KEY = "x-refresh-token";

export const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

export const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const generateAccessToken = async (user) => {
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

export const generateRefreshToken = async (userId) => {
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
