import { prompts } from "../configs/prompts";

type GeneratePrompt = {
  name: keyof typeof prompts;
  context: string;
};

export const generatePrompt = ({ name, context }: GeneratePrompt) => {
  const prompt = prompts[name];
  const promptWithContext = `${context}\n\n${prompt}`;
  return promptWithContext;
};
