const baseRoute = process.env.EVOLUTION_BASE_URL!;
const instanceName = process.env.EVOLUTION_INSTANCE_ID!;
const apikey = process.env.EVOLUTION_API_KEY!;

export const sendMessage = async ({
  message,
  to,
}: {
  message: string;
  to: string;
}) => {
  const body = {
    text: message,
    number: to,
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: apikey,
    },
    body: JSON.stringify(body),
  };
  try {
    const response = await fetch(
      `${baseRoute}/message/sendText/${instanceName}`,
      options
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return;
  }
};
