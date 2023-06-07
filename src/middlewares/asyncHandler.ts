import { Req, Res, Next } from "../types";

type Fn = (req: Req, res: Res, next: Next) => any;

const asyncHandler = (fn: Fn) => (req: Req, res: Res, next: Next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export default asyncHandler;
