const rateLimit = require("express-rate-limit");

import asyncHandler from "../middlewares/asyncHandler";

const limitRequest = (duration: number, max: number, errorMessage?: string) =>
  rateLimit({
    windowMs: duration,
    max,
    message: asyncHandler(async (req, res, next) => {
      return res.status(429).json({
        success: false,
        data: null,
        message: errorMessage
          ? errorMessage
          : "Too many request, try again later",
      });
    }),
  });

export default limitRequest;
