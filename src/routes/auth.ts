import express from "express";
import multer from "multer";

import {
  currentUser,
  login,
  updateInfo,
  updatePhoto,
  updateToOffline,
  updateToOnline,
} from "../controllers/auth";

import protect from "../middlewares/protect";
import uploadFile from "../middlewares/uploadFile/index";

const router = express.Router();
const updalod = multer();

// Logout handled by nextjs server -> just removing the token from cookies and redirect
router.post("/login", login);

router.get("/currentUser", protect, currentUser);

router.put(
  "/updatephoto",
  protect,
  updalod.single("photo"),
  uploadFile,
  updatePhoto
);

router.put("/updateinfo", protect, updateInfo);

router.put("/online", updateToOnline);
router.put("/offline", updateToOffline);

export default router;
