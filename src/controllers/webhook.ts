import { Request, Response } from "express";
import { keywords } from "../configs/keyword";
import { allowedGroups } from "../configs/allowed-groups";
import { summary } from "./summary";

export const webhook = async (req: Request, res: Response) => {
  const { data } = req.body;
  const groupId = data.key.remoteJid;
  const messageId = data.key.id;
  const message = data.message?.conversation as string;
  const pushName = data.pushName;
  const isCommand = keywords.some(
    (keyword) => message && message.toLowerCase() === keyword.toLowerCase()
  );
  const isAllowedGroup = allowedGroups.includes(groupId);
  console.log("----- webhook");
  console.log({
    body: req.body,
    isCommand,
    isAllowedGroup,
    message,
    pushName,
    groupId,
  });
  if (isCommand && isAllowedGroup) {
    console.log("gerando resumo...");
    await summary({ groupId, messageId });
    console.log("...finalizado");
  }
  res.status(200).send("OK");
};
