import express from "express";

import { getOnlineUsers, getUsers } from "../controllers/users";

import advancedResults from "../middlewares/advancedResults";

const router = express.Router();

router.get("/", getUsers, advancedResults);
router.get("/online", getOnlineUsers, advancedResults);

export default router;
