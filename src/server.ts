require("dotenv").config({ path: "./config/.env.local" });

import express from "express";

// Route files
import chats from "./routes/chats";

const app = express();

const PORT = process.env.PORT || 5000;

// All route must receive associated with token in the header
app.use();

// Mount routes
app.use("/api/chats", chats);

// Error handler middleware

app.listen(PORT, () => console.log(`Server running on PORT:${PORT}`));
