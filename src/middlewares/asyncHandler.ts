import { NextFunction } from "express";
import { Req, Res } from "../types";

type Fn = (req: Req, res: Res, next: NextFunction) => any;

const asyncHandler = (fn: Fn) => (req: Req, res: Res, next: NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export default asyncHandler;
