import { Router } from "express";

import apiRoutes from "./api/index";
import authRoutes from "./api/auth-routes";

import { authenticateToken } from "../middleware/auth";

const router = Router();

router.use("/auth", authRoutes);
router.use("/api", authenticateToken, apiRoutes);

export default router;
