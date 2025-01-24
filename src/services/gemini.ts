import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
dotenv.config();

export const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_GEMINI_API_KEY as string
);

export const genModel =
  (process.env.GOOGLE_GEMINI_MODEL as string) || "gemini-1.5-flash";
