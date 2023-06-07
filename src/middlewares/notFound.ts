import ErrorResponse from "../utils/errorResponse";

import { Next, Req, Res } from "../types";

const notFound = (req: Req, res: Res, next: Next) => {
  return next(new ErrorResponse(`Not found '${req.method} - ${req.url}'`, 404));
};

export default notFound;
