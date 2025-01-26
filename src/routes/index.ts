import { Router } from "express";
import healthCheckRouter from "./health-check";
import testeRouter from "./teste";
import webhookRouter from "./webhook";
import cronRouter from "./cron";

const routes = Router();

routes.use(healthCheckRouter);
routes.use(testeRouter);
routes.use(webhookRouter);
routes.use(cronRouter);

export default routes;
