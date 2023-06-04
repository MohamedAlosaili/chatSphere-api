import { NextFunction, Request, Response } from "express";

import { User } from "../models/User";

type Req = Request & { user?: User };
type Res = Response;
type Fn = (req: Req, res: Res, next: NextFunction) => any;

const asyncHandler = (fn: Fn) => (req: Req, res: Res, next: NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export default asyncHandler;
