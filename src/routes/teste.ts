import { Router } from "express";
import { prisma } from "../prisma";
import { getDateRange } from "../utils/get-date-range";

const router = Router();
const developmentDate = process.env.DEVELOPMENT_DATE;
const baseRoute = process.env.EVOLUTION_BASE_URL!;
const instanceName = process.env.EVOLUTION_INSTANCE_ID!;
const apikey = process.env.EVOLUTION_API_KEY!;

router.get("/messages", async (req, res) => {
  const { group_id } = req.query;
  const { startDate, endDate } = getDateRange(developmentDate);
  const messages = await prisma.message.findMany({
    where: {
      AND: [
        {
          key: {
            path: ["remoteJid"],
            equals: group_id,
          },
        },
        {
          messageTimestamp: {
            gte: startDate,
            lte: endDate,
          },
        },
        {
          NOT: {
            OR: [
              {
                message: {
                  path: ["conversation"],
                  string_starts_with: "Resumo do dia ",
                },
              },
              {
                message: {
                  path: ["conversation"],
                  string_starts_with: "#resumododia",
                },
              },
            ],
          },
        },
      ],
    },
    orderBy: {
      messageTimestamp: "desc",
    },
  });
  res.status(200).json({
    total: messages.length,
    data: messages,
  });
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
