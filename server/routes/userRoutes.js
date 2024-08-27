import express from "express";
import { userController } from "../controllers/index.js"
import { validationMiddleware, checkAuth, handleValidationErrors } from "../middlewares/index.js";

const router = express.Router();

// Регистрация
router.post(
    "/register",
    validationMiddleware.register,
    handleValidationErrors,
    userController.registerUser
);

// Логин
router.post(
    "/login",
    validationMiddleware.login,
    handleValidationErrors,
    userController.loginUser
);

// Получение пользователя по токену
router.get(
    "/users/me",
    checkAuth,
    userController.authMe
);

export default router;