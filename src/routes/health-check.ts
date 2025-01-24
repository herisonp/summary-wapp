import { Router } from "express";
import { healthCheck } from "../controllers/health-check";

const router = Router();

router.get("/healthcheck", healthCheck);

export default router;
