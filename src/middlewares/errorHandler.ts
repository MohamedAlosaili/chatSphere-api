import { Response, NextFunction, Request } from "express";

import { ErrResponse } from "../utils/errorResponse";

const errorHandler = (
  err: Error | ErrResponse,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = "statusCode" in err ? err.statusCode : 500;

  res.status(status).json({
    success: false,
    data: null,
    error: err.message,
  });
};

export default errorHandler;
