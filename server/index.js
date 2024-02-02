import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import { logger } from "./config/logger.js";
import { userController, itemController, userSoldItemController, userOwnedItemController } from "./controllers/index.js";
import { checkAuth, checkPermission, validationMiddleware } from "./middlewares/index.js";
import { handleValidationErrors } from "./utils/errorHandler.js";
import { apiKeyD2Market, cookieSteam } from "./config/authorization.js";

const app = express();
app.use(express.json());
app.use(cors());

// USER
app.post("/api/signup", validationMiddleware.register, handleValidationErrors, userController.signup); // Регистрация
app.post("/api/signin", validationMiddleware.login, handleValidationErrors, userController.signin); // Авторизация
app.get("/api/auth", checkAuth, userController.authMe); // Авторизация по токену

// ITEM
app.post("/api/items", checkAuth, checkPermission.isAdmin, validationMiddleware.newItemCreate, handleValidationErrors, itemController.create);
app.delete("/api/items/:id", checkAuth, checkPermission.isAdmin, itemController.remove);
app.get("/api/items", checkAuth, itemController.getAll);
app.get("/api/items/:id", checkAuth, itemController.getOne);

app.patch("/api/items/:itemId", checkAuth, checkPermission.isAdmin, itemController.update);
app.patch("/api/items", checkAuth, checkPermission.isAdmin, itemController.updateAll);

// USER SOLD ITEM
app.post("/api/solditems", checkAuth, checkPermission.isUser, userSoldItemController.create);
app.get("/api/solditems/:userId", checkAuth, checkPermission.isUser, userSoldItemController.getAll);
app.delete("/api/solditems/:itemId", checkAuth, checkPermission.isSoldItemOwner, userSoldItemController.deleteOne);

// USER OWNED ITEM
app.post("/api/owneditems", checkAuth, checkPermission.isUser, userOwnedItemController.create);
app.patch("/api/owneditems/:itemId", checkAuth, checkPermission.isItemOwner, userOwnedItemController.edit);
app.get("/api/owneditems/:userId", checkAuth, checkPermission.isUser, userOwnedItemController.getAll);
app.delete("/api/owneditems/:itemId", checkAuth, checkPermission.isItemOwner, userOwnedItemController.deleteOne);

try {
  if(!cookieSteam.length) {
    throw new Error("Steam Cookie is empty")
  }

  if(!apiKeyD2Market.length) {
    throw new Error("API Key Dota2 Market is empty")
  }

  await mongoose.connect("writeMongoDB");
  logger.info("Success: Database connected!");
  app.listen(4445, (err) => {
    if (err) {
      return logger.error(err);
    }
    logger.info("Success: Server created!");
  });
} catch (err) {
  logger.error("Error during startup:", err);
};