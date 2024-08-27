import { body } from 'express-validator';

// Логин
export const login = [
    body('email')
        .isEmail()
        .withMessage('Invalid email format.'),
    body('password')
        .isLength({ min: 5 })
        .withMessage('Password must be at least 5 characters long.'),
];

// Регистрация
export const register = [
    body('username')
        .isLength({ min: 3 })
        .withMessage('Name must be at least 3 characters long.'),
    body('email')
        .isEmail()
        .withMessage('Invalid email address.'),
    body('password')
        .isLength({ min: 5 })
        .withMessage('Password must be at least 5 characters long.'),
    body('imageUrl')
        .optional()
        .isURL()
        .withMessage('Image URL must be a valid URL.'),
];

// Создания нового предмета
export const newItemCreate = [
    body('heroName')
        .isLength({ min: 3 })
        .withMessage('Hero name must be at least 3 characters long.'),
    body('itemName')
        .isLength({ min: 3 })
        .withMessage('Item name must be at least 3 characters long.'),
    body('imageUrl')
        .isURL()
        .withMessage('Image URL must be a valid URL.'),
];

// Создания предмета, принадлежащего пользователю
export const userOwnedItemCreate = [
    body('userId')
        .isMongoId()
        .withMessage('User ID must be a valid MongoDB ObjectId.'),
    body('itemId')
        .isMongoId()
        .withMessage('Item ID must be a valid MongoDB ObjectId.'),
    body('buyPrice')
        .isNumeric({ min: 1 })
        .withMessage('Buy price must be at least 1.'),
    body('quantity')
        .isNumeric({ min: 1 })
        .withMessage('Quantity must be at least 1.'),
];

// Создания предмета, проданного пользователем
export const userSoldItemCreate = [
    body('userId')
        .isMongoId()
        .withMessage('User ID must be a valid MongoDB ObjectId.'),
    body('itemId')
        .isMongoId()
        .withMessage('Item ID must be a valid MongoDB ObjectId.'),
    body('buyPrice')
        .isNumeric({ min: 1 })
        .withMessage('Buy price must be at least 1.'),
    body('sellPrice')
        .isNumeric({ min: 1 })
        .withMessage('Sold price must be at least 1.'),
    body('quantity')
        .isNumeric({ min: 1 })
        .withMessage('Quantity must be at least 1.'),
];