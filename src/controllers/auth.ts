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
