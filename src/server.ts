require("dotenv").config({ path: "./src/config/.env.local" });

import express from "express";
import colors from "colors";
import connectDB from "./config/db";

// Middlewares
import protect from "./middlewares/protect";
import errorHandler from "./middlewares/errorHandler";
import notFound from "./middlewares/notFound";

// Route files
import chats from "./routes/chats";
import auth from "./routes/auth";

const app = express();
app.use(express.json());
connectDB();

// Mount routes
app.use("/api/auth", auth);
app.use("/api/chats", protect, chats);

// Error handler middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
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
