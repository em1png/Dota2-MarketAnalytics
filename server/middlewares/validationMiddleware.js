import { body } from 'express-validator';

export const login = [
    body('email', 'Invalid email format.').isEmail(),
    body('password', 'Password must be at least 5 characters long.').isLength({ min: 5 }),
];

export const register = [
    body('username', 'Name must be at least 3 characters long.').isLength({ min: 3 }),
    body('email', 'Invalid email address.').isEmail(),
    body('password', 'Password must be at least 5 characters long.').isLength({ min: 5 }),
    body('imageUrl').optional().isURL(),
];

export const newItemCreate = [
    body('heroName', 'Hero name must be at least 3 characters long.').isLength({ min: 3 }),
    body('itemName', 'Item name must be at least 3 characters long.').isLength({ min: 3 }),
    body('imageUrl').isURL(),
];

export const userOwnedItemCreate = [
    body('userId', 'userId must be a valid MongoDB ObjectId.').isMongoId(),
    body('itemId', 'ItemId must be a valid MongoDB ObjectId.').isMongoId(),
    body('buyPrice', 'Buy price must be at least 1.').isNumeric({ min: 1 }),
    body('quantity', 'Quantity must be at least 1.').isNumeric({ min: 1 }),
];

export const userSoldItemCreate = [
    body('userId', 'userId must be a valid MongoDB ObjectId.').isMongoId(),
    body('itemId', 'ItemId must be a valid MongoDB ObjectId.').isMongoId(),
    body('buyPrice', 'Buy price must be at least 1.').isNumeric({ min: 1 }),
    body('sellPrice', 'Sold price must be at least 1.').isNumeric({ min: 1 }),
    body('quantity', 'Quantity must be at least 1.').isNumeric({ min: 1 }),
];
