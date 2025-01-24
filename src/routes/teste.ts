import { Router } from "express";
import { prisma } from "../prisma";

const router = Router();

const baseRoute = process.env.EVOLUTION_BASE_URL!;
const instanceName = process.env.EVOLUTION_INSTANCE_ID!;
const apikey = process.env.EVOLUTION_API_KEY!;
const groupId = "120363280834070311@g.us";

const today = new Date("2025/01/23").toUTCString();
const startDate = Math.floor(new Date(today).setHours(0, 0, 0, 0) / 1000);
const endDate = Math.floor(new Date(today).setHours(23, 59, 59, 999) / 1000);

router.get("/teste", async (req, res) => {
  const body = {
    where: {
      key: {
        remoteJid: groupId,
      },
    },
    page: 1,
    offset: 0,
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: apikey,
    },
    body: JSON.stringify(body),
  };

  const response = await fetch(
    `${baseRoute}/chat/findMessages/${instanceName}?currentPage=2`,
    options
  );
  const data = await response.json();
  res.json(data);
});

// filtrar todas as mensagens do dia
router.get("/teste2", async (req, res) => {
  const response = await prisma.message.findMany({
    where: {
      key: {
        path: ["remoteJid"],
        equals: groupId,
      },
      messageTimestamp: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: {
      messageTimestamp: "desc",
    },
  });
  res.json({ total: response.length, messages: response });
});

// como listar todos os grupos
router.get("/teste3", async (req, res) => {
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

// como enviar mensagens nos grupos
router.get("/teste-4", async (req, res) => {
  const body = {
    text: "Olá",
    number: groupId,
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: apikey,
    },
    body: JSON.stringify(body),
  };

  const response = await fetch(
    `${baseRoute}/message/sendText/${instanceName}`,
    options
  );
  const data = await response.json();
  res.json(data);
});

export default router;
