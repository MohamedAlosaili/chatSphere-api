import { Error } from "mongoose";
import colors from "colors";

import ErrorResponse from "../utils/errorResponse";

// Types
import { Next, Req, Res } from "../types";

// Fub fact 😁:
//      if you remove on of the argument below this middleware won't work
//      Express will use the default error handler instead

const errorHandler = (
  err: Error | ErrorResponse,
  req: Req,
  res: Res,
  next: Next
) => {
  let error = { ...err };
  error.message = err.message;

  console.log(colors.red(err.stack ?? ""));

  // Mongoose wrong ID.
  if (err.name === "CastError") {
    error = new ErrorResponse(`Resource not found`, 404);
  }

  // Mongoose duplicate key.
  if ("code" in err && err.code === 11000) {
    error = new ErrorResponse("Duplicate field value entered", 400);
  }

  // Mongoose invalid values.
  if (err.name === "ValidationError") {
    const message = Object.values((err as Error.ValidationError).errors)
      .map(value => value.message)
      .join(", ");

    error = new ErrorResponse(message, 400);
  }

  const status = "statusCode" in error ? error.statusCode : 500;

  res.status(status).json({
    success: false,
    data: null,
    error: error.message || "Internal Server Error",
  });
};

export default errorHandler;
