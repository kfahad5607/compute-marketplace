import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import config from "./config.js";
import UsersRouter from "./routes/users.js";
import GpusRouter from "./routes/gpus.js";

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

app.use("/api/v1/users", UsersRouter);
app.use("/api/v1/gpus", GpusRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = res.statusCode || 500;
  res.status(statusCode).json({
    status: "fail",
    error: err.message || "Internal Server Error",
  });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});