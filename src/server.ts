require("dotenv").config({ path: "./src/config/.env.local" });

import http from "http";
import express from "express";
import colors from "colors";
import connectDB from "./config/db";
import socketIO from "./socket.io";

// Middlewares
import protect from "./middlewares/protect";
import errorHandler from "./middlewares/errorHandler";
import notFound from "./middlewares/notFound";

// Security packages
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
// require() to escape from the type declaration error
// TODO: update with package support TypeScript
const { xss } = require("express-xss-sanitizer");
import limitRequest from "./lib/rateLimit";

// Route files
import auth from "./routes/auth";
import users from "./routes/users";
import rooms from "./routes/rooms";
import search from "./routes/search";

const app = express();
const server = http.createServer(app);
socketIO(server);
app.use(express.json());
connectDB();

// # Security middlewares #
// Sanitize Data to prevent NoSQL injection
app.use(mongoSanitize());
// Helmet secure Express app by setting various HTTP security headers.
app.use(helmet());
// Prevent cross-site scripting (XSS) attack
app.use(xss());

app.use(limitRequest(1 * 60 * 1000, 150));

// Mount routes
app.use("/api/auth", auth);
app.use("/api/users", protect, users);
app.use("/api/rooms", protect, rooms);
app.use("/api/search", protect, search);

// Error handler middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(colors.yellow.bold(`Server running on PORT:${PORT}`));
  console.log(colors.blue.bold(`Environment mode: ${process.env.NODE_ENV}`));
});

process.on("unhandledRejection", err => {
  if (err instanceof Error && process.env.NODE_ENV === "development") {
    console.log(colors.red.inverse(`MESSAGE: ${err.message}`));
    console.log(colors.red(err.stack || ""));
  } else {
    console.log(colors.red(String(err)));
  }

  server.close(() => process.exit(1));
});
