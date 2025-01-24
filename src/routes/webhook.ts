import { Router } from "express";
import { webhook } from "../controllers/webhook";

const router = Router();

router.post("/webhook", webhook);

export default router;
