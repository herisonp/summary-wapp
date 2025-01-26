import { prisma } from "../prisma";

const developmentGroupId = process.env.DEVELOPMENT_GROUP_ID;

export const getMessages = async ({
  groupId,
  startDate,
  endDate,
}: {
  groupId: string;
  startDate: number;
  endDate: number;
}) => {
  return await prisma.message.findMany({
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
              {
                contextInfo: {
                  path: ["quotedMessage", "conversation"],
                  string_starts_with: "Resumo do dia ",
                },
              },
              {
                contextInfo: {
                  path: ["quotedMessage", "conversation"],
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
};
