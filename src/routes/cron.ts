import { Router } from "express";
import { cron } from "../controllers/cron";

const router = Router();

router.get("/cron", cron);

export default router;
