import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { logger } from "../config/logger.js";
import { JWT_SECRET } from "../utils/constants.js"

import userModel from "../models/userModel.js";

export const signup = async (req, res) => {
  try {
    const { username, email, password, imageUrl } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      username: username,
      email: email,
      passwordHash: hash,
      accessLevel: "user",
      imageUrl: imageUrl,
    });
    const user = await newUser.save();

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "30d" });

    const { passwordHash, __v, updatedAt, createdAt, accessLevel, ...userData } = user._doc;
    res.status(201).json({ ...userData, token });
  } catch (err) {
    logger.error("Registration error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "30d" });

    const { passwordHash, __v, updatedAt, createdAt, ...userData } = user._doc;
    res.status(200).json({ ...userData, token });
  } catch (err) {
    logger.error("Login error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const authMe = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await userModel.findOne({ _id: req.userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { passwordHash, ...userData } = user._doc;
    res.status(200).json({ ...userData });
  } catch (err) {
    logger.error("AuthMe error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};