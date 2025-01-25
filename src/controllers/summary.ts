import path from "path";
import { disableHistory } from "../configs/disable_history";
import { intervalSummary } from "../configs/interval-summary";
import { mainPrompt } from "../configs/main-prompt";
import { prisma } from "../prisma";
import { genAI, genModel } from "../services/gemini";
import { sendMessage, sendSticker } from "../services/whatsapp";
import { fileToBase64 } from "../utils/file-to-base64";
import { getDateRange } from "../utils/get-date-range";

const developmentDate = process.env.DEVELOPMENT_DATE;
const developmentGroupId = process.env.DEVELOPMENT_GROUP_ID;

export const summary = async ({
  groupId,
  messageId,
}: {
  groupId: string;
  messageId: string;
}) => {
  const { startDate, endDate } = getDateRange(developmentDate);

  console.log("developmentDate", developmentDate);
  console.log("developmentGroupId", developmentGroupId);
  console.log("disableHistory", disableHistory);
  console.log(
    "startDate",
    new Date(startDate * 1000).toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
    })
  );
  console.log(
    "endDate",
    new Date(endDate * 1000).toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
    })
  );

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
  const hasHistoric = !!historic && !!historic.summary && !disableHistory;

  if (hasHistoric) {
    console.log("resumo já gerado, enviando do histórico...");
    await sendMessage({
      message: historic.summary!,
      to: groupId,
      quotedId: messageId,
    });
    return;
  }

  console.log("Buscando mensagens...");
  const messages = await prisma.message.findMany({
    where: {
      AND: [
        {
          key: {
            path: ["remoteJid"],
            equals: developmentGroupId || groupId,
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

  const chatSession = model.startChat({
    generationConfig,
  });

  try {
    const stickerPath = path.resolve(
      __dirname,
      "../assets/stickers/gerando-resumo.webp"
    );
    const sticker = await fileToBase64(stickerPath);
    const responseSticker = await sendSticker({
      sticker,
      to: groupId,
      quotedId: messageId,
    });
    console.log("resposta do sticker", responseSticker);
    console.log("Enviando mensagens para o modelo...");
    const result = await chatSession.sendMessage(JSON.stringify(messages));

    console.log("Resumo gerado pelo modelo...");
    const summaryText = result.response.text();

    console.log("Salvando no banco de dados...");
    await prisma.shippingLog.create({
      data: {
        groupId,
        summary: summaryText,
      },
    });

    console.log("Enviando para o grupo...");
    await sendMessage({
      message: summaryText,
      to: groupId,
      quotedId: messageId,
    });

    return;
  } catch (error) {
    console.log(error);
    return;
  }
};
