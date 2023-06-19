import User from "../models/User";
import asyncHandler from "../middlewares/asyncHandler";

import regex from "../utils/regex";
import ErrorResponse from "../utils/errorResponse";
import { signJwtToken } from "../lib/jwtToken";
import { sendLoginLink } from "../lib/sendEmail";

// Types
import { Req, Res } from "../types";

// @desc    Send login link
// @route   POST /api/auth/login
// access   Public
export const login = asyncHandler(async (req, res, next) => {
  const email = req.body.email?.toLowerCase();

  if (!regex.validEmail.test(email)) {
    return next(new ErrorResponse("Invalid email", 400));
  }

  let user = await User.findOne({ email });

  // Create a new user if the email doesn't have an associated account
  // This will improve the user experience and simplify the login process
  if (!user) {
    user = await User.create({ email });
  }

  const token = signJwtToken({ id: user._id }, { expiresIn: "20m" });

  const url = `${getOrigin()}/verify?token=${token}`;
  await sendLoginLink(email, url);

  res.status(200).json({
    success: true,
    data: null,
    message: "Email sent successfully",
  });
});

const getOrigin = () => {
  return process.env.NODE_ENV !== "production"
    ? process.env.DEV_CLIENT_URL
    : process.env.PROD_CLIENT_URL;
};

// @desc    Get currentUser info
// @route   PUT /api/auth/currentUser
// access   Private - requested with user id
export const currentUser = (req: Req, res: Res) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
};

// @desc    Update User photo
// @route   PUT /api/auth/updatephoto
// access   Private
export const updatePhoto = asyncHandler(async (req, res, next) => {
  const photo = req.body.uploadedFile?.url;

  if (!photo) {
    return res.status(200).json({
      success: true,
      data: req.user,
      message: "Nothing was changed.",
    });
  }

  await User.updateOne({ _id: req.user?._id }, { photo });

  res.status(200).json({
    success: true,
    data: null,
  });
});

// @desc    Update User ingo
// @route   PUT /api/auth/updatephoto
// access   Private
export const updateInfo = asyncHandler(async (req, res, next) => {
  const { username } = req.body;

  if (!username) {
    return res.status(200).json({
      success: true,
      data: null,
      message: "Nothing was changed.",
    });
  }

  await User.updateOne({ _id: req.user?._id }, { username });

  res.status(200).json({
    success: true,
    data: null,
  });
});

// @desc    Update to online
// @route   PUT /api/auth/online
// access   Private - requested with user id
export const updateToOnline = asyncHandler(async (req, res, next) => {
  const { id } = req.body;

  if (!id) {
    return next(new ErrorResponse("Not authorized", 401));
  }

  const user = await User.findByIdAndUpdate(
    id,
    { isOnline: true },
    { new: true }
  ).select("+email");

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Update to offline
// @route   PUT /api/auth/offline
// access   Private - requested with user id
export const updateToOffline = asyncHandler(async (req, res, next) => {
  const { id } = req.body;

  if (!id) {
    return next(new ErrorResponse("Not authorized", 401));
  }

  const user = await User.findByIdAndUpdate(
    id,
    { isOnline: false },
    { new: true }
  ).select("+email");

  res.status(200).json({
    success: true,
    data: user,
  });
});
