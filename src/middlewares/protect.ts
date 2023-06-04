import jwt from "jsonwebtoken";

import ErrorResponse from "../utils/errorResponse";
import asyncHandler from "./asyncHandler";
import User from "../models/User";

const protect = asyncHandler(async (req, res, next) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  ) {
    return next(
      new ErrorResponse("Invalid/Missing Bearer authorization header", 401)
    );
  }

  const token = req.headers.authorization.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as {
      id: string;
    };

    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new ErrorResponse("Not authorized", 401));
    }

    // Create user object in the request
    req.user = user;

    next();
  } catch (err) {
    return next(new ErrorResponse("Not authorized", 401));
  }
});

export default protect;
