import { Router } from "express";
import { getDateRange } from "../utils/get-date-range";
import { getMessages } from "../services/messages";
import { queryExternalDb } from "../services/evolution-db";
import { prisma } from "../prisma";

const router = Router();
const developmentDate = process.env.DEVELOPMENT_DATE;
// const developmentGroupId = process.env.DEVELOPMENT_GROUP_ID || "";
const baseRoute = process.env.EVOLUTION_BASE_URL!;
const instanceName = process.env.EVOLUTION_INSTANCE_ID!;
const apikey = process.env.EVOLUTION_API_KEY!;

router.get("/messages", async (req, res) => {
  const { group_id } = req.query;

  if (!group_id) {
    res.status(400).json({
      message: "group_id is required",
    });
  }

  const { startDate, endDate } = getDateRange(developmentDate);

  const messages = await getMessages({
    groupId: group_id as string,
    startDate,
    endDate,
  });
  res.status(200).json({
    total: messages.length,
    data: messages,
  });
});

router.get("/messages-sql", async (req, res) => {
  const { group_id } = req.query;
  const groupId = group_id as string;
  const { startDate, endDate } = getDateRange(developmentDate);
  const query = `
  SELECT * FROM "Message"
  WHERE 
      key ->> 'remoteJid' = $1
      AND "messageTimestamp" BETWEEN $2 AND $3
      AND NOT (
          message ->> 'conversation' LIKE 'Resumo do dia %'
          OR message ->> 'conversation' LIKE '#resumododia%'
          OR "contextInfo" -> 'quotedMessage' ->> 'conversation' LIKE 'Resumo do dia %'
          OR "contextInfo" -> 'quotedMessage' ->> 'conversation' LIKE '#resumododia%'
          OR "contextInfo" IS NULL
      )
  ORDER BY "messageTimestamp" DESC;
`;

  const values = [groupId, startDate, endDate];
  const data = await queryExternalDb(query, values);
  res.json(data);
});

router.get("/summary/last", async (req, res) => {
  const { group_id } = req.query;
  const groupId = group_id as string;
  const summary = await prisma.shippingLog.findFirst({
    where: {
      groupId: groupId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  if (!summary || !summary.createdAt) {
    return;
  }
  res.json({
    ...summary,
    createdAtBr: summary?.createdAt?.toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
    }),
  });
  return;
});

// como listar todos os grupos
router.get("/groups", async (req, res) => {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      apikey: apikey,
    },
  };

  const response = await fetch(
    `${baseRoute}/group/fetchAllGroups/${instanceName}?getParticipants=false`,
    options
  );
  const data = await response.json();
  res.json(data);
});

export default router;
