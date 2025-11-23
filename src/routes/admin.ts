import { Router } from "express";
import { getAllUsers, deleteUser, getUserCount } from "../controllers/admin.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";

const router = Router();

router.use(authMiddleware, adminMiddleware);

router.get("/users", getAllUsers);
router.get("/users/count", getUserCount);
router.delete("/users/:id", deleteUser);

export default router;
