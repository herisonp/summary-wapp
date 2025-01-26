const baseRoute = process.env.EVOLUTION_BASE_URL!;
const instanceName = process.env.EVOLUTION_INSTANCE_ID!;
const apikey = process.env.EVOLUTION_API_KEY!;

const request = async (endPoint: string, body: object) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: apikey,
    },
    body: JSON.stringify(body),
  };
  try {
    const response = await fetch(`${baseRoute}${endPoint}`, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return;
  }
};

export const sendSticker = async ({
  sticker,
  to,
  quotedId,
}: {
  sticker: string;
  to: string;
  quotedId?: string;
}) => {
  const body = {
    sticker,
    number: to,
    ...(quotedId ? { quoted: { key: { id: quotedId } } } : {}),
  };

  return await request(`/message/sendSticker/${instanceName}`, body);
};

export const sendMessage = async ({
  message,
  to,
  quotedId,
}: {
  message: string;
  to: string;
  quotedId?: string;
}) => {
  const body = {
    text: message,
    number: to,
    linkPreview: true,
    ...(quotedId ? { quoted: { key: { id: quotedId } } } : {}),
  };

  return await request(`/message/sendText/${instanceName}`, body);
};
