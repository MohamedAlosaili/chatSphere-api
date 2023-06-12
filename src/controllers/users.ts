import User from "../models/User";

// Types
import { Next, Req, Res } from "../types";

// @desc    Get All users
// @route   GET /api/users
// access   Private
export const getUsers = (req: Req, res: Res, next: Next) => {
  req.model = User;
  req.filterQuery = { _id: { $ne: req.user?._id } };

  next();
};

// @desc    Get online users
// @route   GET /api/users/online
// access   Private
export const getOnlineUsers = (req: Req, res: Res, next: Next) => {
  req.model = User;
  req.filterQuery = {
    _id: { $ne: req.user?._id },
    isOnline: true,
  };

  next();
};

// @desc    Get offline users
// @route   GET /api/users/offline
// access   Private
export const getOfflineUsers = (req: Req, res: Res, next: Next) => {
  req.model = User;
  req.filterQuery = {
    _id: { $ne: req.user?._id },
    isOnline: false,
  };

  next();
};
