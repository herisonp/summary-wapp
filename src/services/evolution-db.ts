import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const externalDbConfig = {
  user: process.env.EVO_DB_USER,
  host: process.env.EVO_DB_HOST,
  database: process.env.EVO_DB_NAME,
  password: process.env.EVO_DB_PASS,
  port: Number(process.env.EVO_DB_PORT) || 5432,
  ssl:
    process.env.EVO_DB_SSL === "true" ? { rejectUnauthorized: false } : false,
};

const pool = new Pool(externalDbConfig);

export const queryExternalDb = async <T>(
  query: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: any[] = []
): Promise<T[]> => {
  const client = await pool.connect();
  try {
    const result = await client.query(query, params);
    return result.rows;
  } catch (error) {
    console.error("Erro ao consultar banco externo:", error);
    throw error;
  } finally {
    client.release();
  }
};
