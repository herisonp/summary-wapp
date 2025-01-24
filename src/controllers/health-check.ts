import { Request, Response } from "express";

export const healthCheck = async (req: Request, res: Response) => {
  res.send("I am alive!");
};
