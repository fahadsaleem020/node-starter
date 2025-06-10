import { dbConfig } from "./connection.config";
import MySQLStore from "express-mysql-session";
import * as session from "express-session";

const Mysql = MySQLStore(session);
export const store = new Mysql({
  checkExpirationInterval: 10 * 60 * 1000,
  createDatabaseTable: false,
  clearExpired: true,
  ...dbConfig,
});
