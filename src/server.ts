require("dotenv").config({ path: "./src/config/.env.local" });

import express from "express";
import colors from "colors";
import connectDB from "./config/db";

// Middlewares
import errorHandler from "./middlewares/errorHandler";
import protect from "./middlewares/protect";

// Route files
import chats from "./routes/chats";

const app = express();
connectDB();

// All route must receive associated with token in the header
app.use(protect);

// Mount routes
app.use("/api/chats", chats);

// Error handler middleware
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
