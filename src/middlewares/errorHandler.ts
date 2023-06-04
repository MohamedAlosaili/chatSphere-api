import { Response } from "express";
import { NextFunction, Request } from "express";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = "statusCode" in err ? err.statusCode : 500;

  req;

  res.status(status).json({
    success: false,
    data: null,
    error: err.message,
  });
};

export default errorHandler;
