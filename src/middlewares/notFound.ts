import { NextFunction, Request, Response } from "express";

import ErrorResponse from "../utils/errorResponse";

const notFound = (req: Request, res: Response, next: NextFunction) => {
  return next(new ErrorResponse(`Not found '${req.url}'`, 404));
};

export default notFound;
