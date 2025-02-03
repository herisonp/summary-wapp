import path from "path";
import { disableHistory } from "../configs/disable_history";
import { intervalSummary } from "../configs/interval-summary";
import { prisma } from "../prisma";
import { genAI, genModel } from "../services/gemini";
import { sendMessage, sendSticker } from "../services/whatsapp";
import { fileToBase64 } from "../utils/file-to-base64";
import { getDateRange } from "../utils/get-date-range";
import { getMessages } from "../services/messages";
import { generatePrompt } from "../utils/generate-prompt";
import { phoneToLogger } from "../configs/phone-to-logger";

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
  console.log({
    developmentDate,
    developmentGroupId,
    disableHistory,
    startDate: new Date(startDate * 1000).toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
    }),
    endDate: new Date(endDate * 1000).toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
    }),
  });
  try {
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

    console.log("Avisa o grupo que está gerando o resumo...");
    const stickerPath = path.resolve(
      __dirname,
      "../assets/stickers/gerando-resumo.webp"
    );
    const sticker = await fileToBase64(stickerPath);
    await sendSticker({
      sticker,
      to: groupId,
      quotedId: messageId,
    });

    const summaryText = await generateSummary({ groupId });

    console.log("Enviando para o grupo...");
    await sendMessage({
      message:
        summaryText ||
        "> Não foi possível gerar o resumo. Não existem mensagens suficiente ou algum problema aconteceu no servidor. Você sabe o que houve? Se souber, ajuda aí, pô 👍. Se não, tente novamente mais tarde. 🐎",
      to: groupId,
      quotedId: messageId,
    });

    if (!summaryText) {
      const stickerPath = path.resolve(
        __dirname,
        "../assets/stickers/fala-mula.webp"
      );
      const sticker = await fileToBase64(stickerPath);
      await sendSticker({
        sticker,
        to: groupId,
        quotedId: messageId,
      });
    }

    return;
  } catch (error) {
    console.log(error);
    return;
  }
};

export const generateSummary = async ({ groupId }: { groupId: string }) => {
  const { startDate, endDate } = getDateRange(developmentDate);
  try {
    console.log("Buscando mensagens...");
    const messages = await getMessages({
      groupId,
      startDate,
      endDate,
    });

    // Verifica se existem mensagens suficientes para gerar o resumo
    if (messages.length < 4) {
      console.log("Nenhuma mensagem encontrada.");
      return;
    }

    const dateFormatted = new Date(
      new Date(endDate * 1000).toUTCString()
    ).toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
    });
    const context = `[DATA E HORA ATUAL]: ${dateFormatted}`;
    const model = genAI.getGenerativeModel({
      model: genModel,
      systemInstruction: generatePrompt({ name: "main", context }),
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

    return summaryText;
  } catch (error) {
    console.log(error);
    return;
  }
};

export const sendSummary = async ({ groupId }: { groupId: string }) => {
  const now = Date.now();
  const TwoHoursAgo = new Date(new Date(now - intervalSummary).toUTCString());
  const lastSummary = await prisma.shippingLog.findFirst({
    where: {
      groupId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  if (!lastSummary || !lastSummary.summary) {
    console.log("Resumo não encontrado ou está vazio.");
    return;
  }

  if (lastSummary.createdAt! > TwoHoursAgo) {
    console.log("Não tem resumo novo...");
    return;
  }

  const logger = {
    now: new Date(now).toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
    }),
    TwoHoursAgo: new Date(TwoHoursAgo).toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
    }),
    summary: {
      ...lastSummary,
      createdAt: new Date(lastSummary.createdAt!).toLocaleString("pt-BR", {
        timeZone: "America/Sao_Paulo",
      }),
    },
  };

  console.log("Enviando para o grupo...");
  await sendMessage({
    message: lastSummary.summary,
    to: groupId,
  });

  console.log(logger);
  if (phoneToLogger) {
    await sendMessage({
      message: JSON.stringify(logger),
      to: phoneToLogger,
    });
  }
  return;
};
