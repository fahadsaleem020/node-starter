import { database, migrateSchema } from "@/configs/connection.config";
import { Request, Router } from "express";
import { config } from "dotenv";
import { log } from "@/utils/logger";
const routes = Router();
config();

routes.get("/migrate", async (req: Request, res) => {
  try {
    const db = await database();
    await migrateSchema(db);
    res.end("migration successful.");
  } catch (e) {
    const error = e as Error;
    log.error(error);
    res.end(`migrate failed: \nreason: ${error.message}`);
  }
});

export default routes;
