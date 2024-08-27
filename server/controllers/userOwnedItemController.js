import { logger } from "../utils/logger.js";
import itemModel from "../models/itemModel.js";
import userOwnedItemModel from "../models/userOwnedItemModel.js";
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

    const newItem = new userOwnedItemModel({
      userId: user._id,
      itemId: item._id,
      buyPrice: req.body.buyPrice,
      quantity: req.body.quantity,
    });

    const savedItem = await newItem.save();
    return res.status(201).json(savedItem);
  } catch (err) {
    logger.error("Create user owned item error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const edit = async (req, res) => {
  try {
    const item = await userOwnedItemModel.findById(req.params.itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if(req.body.buyPrice) item.buyPrice = req.body.buyPrice;
    if(req.body.quantity) item.quantity = req.body.quantity;

    const savedItem = await item.save();
    return res.status(201).json(savedItem);
  } catch (err) {
    logger.error("Edit user owned item error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteOne = async (req, res) => {
  try {
    const item = await userOwnedItemModel.findOne({
      _id: req.params.itemId,
    });
    
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const deletedItem = await item.deleteOne();
    return res.status(200).json(deletedItem);
  } catch (err) {
    logger.error("Delete user owned item error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAll = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingItem = await userOwnedItemModel.find({ userId: user._id }).sort({ createdAt: -1 }).exec();

    const itemPromises = existingItem.map(async (item) => {
      const currentItem = await itemModel.findById(item.itemId);
      if (!currentItem) {
        return;
      }

      const { heroName, itemName, imageUrl, steamMarket: { price } } = currentItem;
      return { ...item.toObject(), itemInfo: { heroName, itemName, imageUrl, currentPrice: price } };
    });

    const userItems = await Promise.all(itemPromises);
    
    return res.status(200).json(userItems.filter((item) => item != null));
  } catch (err) {
    logger.error("Get user owned items error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};