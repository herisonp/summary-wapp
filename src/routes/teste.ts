import { Router } from "express";

const router = Router();

const baseRoute = process.env.EVOLUTION_BASE_URL!;
const instanceName = process.env.EVOLUTION_INSTANCE_ID!;
const apikey = process.env.EVOLUTION_API_KEY!;
const groupId = "120363280834070311@g.us";

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
