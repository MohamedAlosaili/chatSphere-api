import express from "express";

import {
  getOfflineUsers,
  getOnlineUsers,
  getUsers,
} from "../controllers/users";

import { advancedResults } from "../middlewares/advancedResults";

const router = express.Router();

router.get("/", getUsers, advancedResults);
router.get("/online", getOnlineUsers, advancedResults);
router.get("/offline", getOfflineUsers, advancedResults);

export default router;
