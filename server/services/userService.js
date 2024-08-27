import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import UserModel from '../models/userModel.js';
import { logger } from '../utils/logger.js';
import userModel from '../models/userModel.js';

export const createUser = async (userData) => {
    try {
        const { username, email, password } = userData;

        // Хеширование пароля
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Создание нового пользователя
        const newUser = new UserModel({ username, email, passwordHash });
        const user = await newUser.save();

        // Создание JWT токена
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });

        // Удаление полей, которые не нужно отправлять
        const { passwordHash: omittedHash, __v, updatedAt, createdAt, accessLevel, ...userResponse } = user._doc;

        // Возвращаем объект с данными пользователя и токеном
        return { ...userResponse, token };
    } catch (err) {
        logger.error("Registration error:", err);
        throw err;
    }
};

export const getUserById = async (userId) => {
    return await UserModel.findById(userId);
};