import { database, migrateSchema } from "@/configs/connection.config";
import { log } from "./logger";

/**
 * @param enableMigration
 * Make sure to pass true before pushing it to production.
 */

export const prepareMigration = async (enableMigration = false) => {
  if (!enableMigration) return null;
  try {
    const db = await database();
    await migrateSchema(db);
    log.info("migration successful.");
  } catch (e) {
    const error = e as Error;
    log.error(`migration failure: ${error.message}`);
    log.warn('make sure to run the command "npm run dbgenerate".');
  }
};
