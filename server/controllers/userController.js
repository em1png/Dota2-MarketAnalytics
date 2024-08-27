import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { logger } from "../utils/logger.js";
import userModel from '../models/userModel.js';

// Контроллер для регистрации пользователя
export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Хеширование пароля
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Создание нового пользователя
        const newUser = new userModel({ username, email, passwordHash });
        const user = await newUser.save();

        // Создание JWT токена
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });

        // Удаление полей, которые не нужно отправлять
        const { passwordHash: omittedHash, __v, updatedAt, createdAt, accessLevel, ...userResponse } = user._doc;

        // Возвращаем объект с данными пользователя и токеном
        res.status(201).json({ ...userResponse, token });
    } catch (err) {
        logger.error("Error in registerUser controller:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Поиск пользователя в БД
        const user = await userModel.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Сравниваем пароли
        const isValidPassword = await bcrypt.compare(password, user.passwordHash);
        if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // Создаем токен
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });

        // Удаление полей, которые не нужно отправлять
        const { passwordHash, __v, updatedAt, createdAt, ...userData } = user._doc;

        // Возвращаем объект с данными пользователя и токеном
        res.status(200).json({ ...userData, token });
    } catch (err) {
        logger.error("Error in loginUser controller:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

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