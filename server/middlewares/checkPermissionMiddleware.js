import userModel from "../models/userModel.js";
import userOwnedItemModel from "../models/userOwnedItemModel.js";
import userSoldItemModel from "../models/userSoldItemModel.js";

export const isUser = async (req, res, next) => {
  if (req.userId == req.body.userId || req.userId == req.params.userId) {
    return next();
  } else {
    const user = await userModel.findOne({ _id: req.userId });
    if (user.accessLevel == "admin") {
      return next();
    } else return res.status(403).json({ message: "Access denied" });
  }
};

// - - - - - - - - - - - - - - - - - - -

export const isAdmin = async (req, res, next) => {
  const user = await userModel.findOne({ _id: req.userId });
  if (user.accessLevel == "admin") {
    return next();
  } else {
    return res.status(403).json({ message: "Access denied" });
  }
};

export const isItemOwner = async (req, res, next) => {
  const item = await userOwnedItemModel.findOne({ _id: req.params.itemId });

  if (item.userId == req.userId) {
    return next();
  } else {
    const user = await userModel.findOne({ _id: req.userId });
    if (user.accessLevel == "admin") {
      return next();
    }

    return res.status(403).json({ message: "Access denied" });
  }
};

export const isSoldItemOwner = async (req, res, next) => {
  const item = await userSoldItemModel.findOne({ _id: req.params.itemId });
  if (item.userId == req.userId) {
    return next();
  } else {
    const user = await userModel.findOne({ _id: req.userId });
    if (user.accessLevel == "admin") {
      return next();
    };

    return res.status(403).json({ message: "Access denied" });
  }
};
