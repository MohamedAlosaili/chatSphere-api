import User from "../models/User";
import ErrorResponse from "../utils/errorResponse";
import asyncHandler from "./asyncHandler";
import { verifyJwtToken } from "../lib/jwtToken";

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
    const decoded = verifyJwtToken(token);

    const user = await User.findById(decoded.id).select("+email");

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
