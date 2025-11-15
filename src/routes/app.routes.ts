import { Router } from "express";
import authRouter from "./auth";
import userRouter from "./user";
import adminRouter from "./admin";

const router = Router();

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/admin", adminRouter);

export default router;
