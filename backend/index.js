import { createServer } from "http";
import express from "express";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import config from "./config.js";
import UsersRouter from "./routes/users.js";
import GpusRouter from "./routes/gpus.js";
import { placeBid } from "./controllers/bids.js";

const port = config.PORT;
const app = express();

app.use(cors({ origin: config.CORS_ORIGIN, credentials: true }));
app.use(cookieParser());
app.use(
  express.json({
    limit: "16kb",
    strict: true,
  })
);

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: config.CORS_ORIGIN,
  },
});

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth.accessToken;
    if (!token) {
      return next(new Error("Authentication error"));
    }

    const decodedToken = jwt.verify(token, config.ACCESS_TOKEN_SECRET);

    socket.user = decodedToken.user;
    next();
  } catch (err) {
    return next(new Error("Authentication error"));
  }
});

io.on("connection", (socket) => {
  console.log("A user connected: ", socket.user.email);

  socket.on("placeBid", async (bid) => {
    console.log(`User ${socket.user.email} placed a bid: `);
    const placedBid = await placeBid(bid, socket.user);
    console.log("placedBid ", placedBid);

    io.emit("newBid", placedBid);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

app.use("/api/v1/users", UsersRouter);
app.use("/api/v1/gpus", GpusRouter);

app.use((err, req, res) => {
  console.error(err.stack);
  const statusCode = res.statusCode || 500;
  res.status(statusCode).json({
    status: "fail",
    error: err.message || "Internal Server Error",
  });
});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
