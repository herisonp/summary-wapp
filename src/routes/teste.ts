import { Router } from "express";
import { getDateRange } from "../utils/get-date-range";
import { getMessages } from "../services/messages";

const router = Router();
const developmentDate = process.env.DEVELOPMENT_DATE;
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
