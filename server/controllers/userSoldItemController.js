import { logger } from "../utils/logger.js";
import itemModel from "../models/itemModel.js";
import userSoldItemModel from "../models/userSoldItemModel.js";
import userModel from "../models/userModel.js";

export const create = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const item = await itemModel.findById(req.body.itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const newItem = new userSoldItemModel({
      userId: user._id,
      itemId: item._id,
      buyPrice: req.body.buyPrice,
      sellPrice: req.body.sellPrice,
      quantity: req.body.quantity,
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    logger.error("Create user sold item error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteOne = async (req, res) => {
  try {
    const item = await userSoldItemModel.findOne({
      _id: req.params.itemId,
    });
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const deletedItem = await item.deleteOne();
    res.status(200).json(deletedItem);
  } catch (err) {
    logger.error("Delete user sold item error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAll = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingItem = await userSoldItemModel.find({ userId: user._id }).sort({ createdAt: -1 }).exec();

    const itemPromises = existingItem.map(async (item) => {
      const currentItem = await itemModel.findById(item.itemId);
      if (!currentItem) {
        return;
      }

      const { heroName, itemName, imageUrl } = await itemModel.findById(item.itemId);
      return { ...item.toObject(), itemInfo: { heroName, itemName, imageUrl } };
    });

    const userItems = await Promise.all(itemPromises);

    return res.status(200).json(userItems.filter((item) => item != null));
  } catch (err) {
    logger.error("Get user sold items error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};