import { Request, Response } from "express";
import { allowedGroups } from "../configs/allowed-groups";
import { generateSummary } from "./summary";

export const cron = async (req: Request, res: Response) => {
  console.log("Executando cron job...");
  await Promise.all(
    allowedGroups.map(async (groupId) => {
      await generateSummary({ groupId });
      console.log("Gerado para:", groupId);
    })
  );
  console.log("Cron job executado!");
  res.send("Cron job executed!");
};
