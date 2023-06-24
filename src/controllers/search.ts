import Room from "../models/Room";
import User from "../models/User";
import ErrorResponse from "../utils/errorResponse";
import {
  availableRoomsPipeline,
  currentUserRoomsPipeline,
} from "../utils/pipelines";

// Types
import { Next, Req, Res } from "../types";

// @desc    Users search
// @route   GET /api/search?q='search text'
// access   Private
export const allUsers = (req: Req, res: Res, next: Next) => {
  const query = req.query.q;
  delete req.query.q;

  if (!query) {
    return next(
      new ErrorResponse("Missing q in query params '?q=search value'", 400)
    );
  }

  req.model = User;
  req.filterQuery = {
    _id: { $ne: req.user?._id },
    username: { $regex: query, $options: "i" },
  };
  next();
};

// @desc    Available rooms search
// @route   GET /api/search/rooms?q='search text'
// access   Private
export const availableRooms = (req: Req, res: Res, next: Next) => {
  const query = req.query.q;
  delete req.query.q;

  if (!query) {
    return next(
      new ErrorResponse("Missing q in query params '?q=search value'", 400)
    );
  }

  req.model = Room;
  req.pipeline = [
    { $match: { name: { $regex: query, $options: "i" } } },
    ...availableRoomsPipeline(req.user!._id),
  ];
  next();
};

// @desc    currentUser rooms search
// @route   GET /api/search/rooms/joined?q='search text'
// access   Private
export const currentUserRooms = (req: Req, res: Res, next: Next) => {
  const query = req.query.q;
  delete req.query.q;

  if (!query) {
    return next(
      new ErrorResponse("Missing q in query params '?q=search value'", 400)
    );
  }

  req.model = Room;
  req.pipeline = [
    { $match: { name: { $regex: query, $options: "i" } } },
    ...currentUserRoomsPipeline(req.user!._id),
  ];
  next();
};
