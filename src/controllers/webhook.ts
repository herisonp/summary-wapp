import { Request, Response } from "express";
import { keywords } from "../configs/keyword";
import { allowedGroups } from "../configs/allowed-groups";
import { summary } from "./summary";

export const webhook = async (req: Request, res: Response) => {
  const { data } = req.body;
  const groupId = data.key.remoteJid;
  const message = data.message?.conversation as string;
  const isCommand = keywords.some(
    (keyword) =>
      message && message.toLowerCase().includes(keyword.toLowerCase())
  );
  const isAllowedGroup = allowedGroups.includes(groupId);
  if (isCommand && isAllowedGroup) {
    console.log("----- webhook");
    console.log("headers", req.headers);
    console.log("body", req.body);
    console.log(message);
    console.log("gerando resumo");
    await summary({ groupId });
  }
  res.status(200).send("OK");
};
