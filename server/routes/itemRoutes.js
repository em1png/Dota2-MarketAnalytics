import express from "express";
import { itemController } from "../controllers/index.js";
import { validationMiddleware, checkAuth, handleValidationErrors, checkPermission } from "../middlewares/index.js";

const router = express.Router();

// Создание нового предмета
router.post(
  "/items",
  checkAuth,
  checkPermission.isAdmin,
  validationMiddleware.newItemCreate,
  handleValidationErrors,
  itemController.create
);

// Удаление предмета по ID
router.delete("/items/:id", 
  checkAuth, 
  checkPermission.isAdmin, 
  itemController.remove
);

// Получение всех предметов
router.get("/items", 
  checkAuth, 
  itemController.getAll
);

// Получение одного предмета по ID
router.get("/items/:id", 
  checkAuth, 
  itemController.getOne
);

// Обновление одного предмета по ID
router.patch("/items/:id", 
  checkAuth, 
  checkPermission.isAdmin, 
  itemController.update
);

// // Обновление всех предметов
// router.patch("/items", 
//   checkAuth, 
//   checkPermission.isAdmin, 
//   itemController.updateAll
// );

export default router;