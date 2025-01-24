import { Router } from "express";
import healthCheckRouter from "./health-check";
import testeRouter from "./teste";
import webhookRouter from "./webhook";

const routes = Router();

routes.use(healthCheckRouter);
routes.use(testeRouter);
routes.use(webhookRouter);

export default routes;
