import { intervalSummary } from "../configs/interval-summary";
import { mainPrompt } from "../configs/main-prompt";
import { prisma } from "../prisma";
import { genAI, genModel } from "../services/gemini";
import { sendMessage } from "../services/whatsapp";
import { getDateRange } from "../utils/get-date-range";

const { startDate, endDate } = getDateRange();

export const summary = async ({ groupId }: { groupId: string }) => {
  // TODO: criar regra para não permitir excesso de requisição por dia
  const TwoHoursAgo = new Date(
    new Date(Date.now() - intervalSummary).toUTCString()
  );
  const historic = await prisma.shippingLog.findFirst({
    where: {
      AND: {
        groupId,
        createdAt: {
          gte: TwoHoursAgo,
        },
      },
    },
  });

  console.log("historic", historic);

  if (historic && historic.summary) {
    await sendMessage({
      message: historic.summary,
      to: groupId,
    });
    return;
  }

  // buscar todas as mensagens do dia
  const messages = await prisma.message.findMany({
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

  const model = genAI.getGenerativeModel({
    model: genModel,
    systemInstruction: mainPrompt,
  });

  const generationConfig = {
    temperature: 0.8,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

  // pensar em passar 1 ou 2 históricos como padrão, para ajudar o modelo a gerar uma resposta
  const chatSession = model.startChat({
    generationConfig,
  });

  const result = await chatSession.sendMessage(JSON.stringify(messages));

  const summaryText = result.response.text();

  await prisma.shippingLog.create({
    data: {
      groupId,
      summary: summaryText,
    },
  });

  await sendMessage({
    message: summaryText,
    to: groupId,
  });

  return;
};
