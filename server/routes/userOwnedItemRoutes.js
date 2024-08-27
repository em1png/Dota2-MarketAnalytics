import express from "express";
import { userOwnedItemController } from "../controllers/index.js";
import { checkAuth } from "../middlewares/checkAuthMiddleware.js";
import { checkPermission } from "../middlewares/index.js";

const router = express.Router();

router.post("/", checkAuth, checkPermission.isUser, userOwnedItemController.create);
router.patch("/:itemId", checkAuth, checkPermission.isItemOwner, userOwnedItemController.edit);
router.get("/:userId", checkAuth, checkPermission.isUser, userOwnedItemController.getAll);
router.delete("/:itemId", checkAuth, checkPermission.isItemOwner, userOwnedItemController.deleteOne);

export default router;