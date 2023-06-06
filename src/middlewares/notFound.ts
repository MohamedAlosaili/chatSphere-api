import { NextFunction, Request, Response } from "express";

import ErrorResponse from "../utils/errorResponse";

const notFound = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body, req.headers.authorization);
  return next(new ErrorResponse(`Not found '${req.method} - ${req.url}'`, 404));
};

export default notFound;
