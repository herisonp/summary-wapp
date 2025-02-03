import { queryExternalDb } from "./evolution-db";

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
  const query = `
    SELECT * 
    FROM "Message"
    WHERE 
      NOT ("message"->>'conversation' LIKE '#resumododia%')
      AND (
        "contextInfo" IS NULL
        OR "contextInfo"->'quotedMessage' IS NULL
        OR "contextInfo"->'quotedMessage'->>'conversation' IS NULL
        OR NOT ("contextInfo"->'quotedMessage'->>'conversation' LIKE '#resumododia%')
      )
      AND "key"->>'remoteJid' = $1
      AND "messageTimestamp" BETWEEN $2 AND $3
    ORDER BY "messageTimestamp" DESC;
  `;

  const values = [developmentGroupId || groupId, startDate, endDate];
  const data = await queryExternalDb(query, values);
  return data;
};

// return await prisma.message.findMany({
//   where: {
//     AND: [
//       {
//         key: {
//           path: ["remoteJid"],
//           equals: developmentGroupId || groupId,
//         },
//       },
//       {
//         messageTimestamp: {
//           gte: startDate,
//           lte: endDate,
//         },
//       },
//       {
//         NOT: {
//           OR: [
//             {
//               message: {
//                 path: ["conversation"],
//                 string_starts_with: "Resumo do dia ",
//               },
//             },
//             {
//               message: {
//                 path: ["conversation"],
//                 string_starts_with: "#resumododia",
//               },
//             },
//             {
//               contextInfo: {
//                 path: ["quotedMessage", "conversation"],
//                 string_starts_with: "Resumo do dia ",
//               },
//             },
//             {
//               contextInfo: {
//                 path: ["quotedMessage", "conversation"],
//                 string_starts_with: "#resumododia",
//               },
//             },
//           ],
//         },
//       },
//     ],
//   },
//   orderBy: {
//     messageTimestamp: "desc",
//   },
// });
