import express from "express";
import { userSoldItemController } from "../controllers/index.js";
import { checkPermission, checkAuth } from "../middlewares/index.js";

const router = express.Router();

router.post("/solditems", checkAuth, checkPermission.isUser, userSoldItemController.create);
router.get("/solditems/:userId", checkAuth, checkPermission.isUser, userSoldItemController.getAll);
router.delete("/solditems/:itemId", checkAuth, checkPermission.isSoldItemOwner, userSoldItemController.deleteOne);

export default router;