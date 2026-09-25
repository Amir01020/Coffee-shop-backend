import mysql from "mysql2/promise";
import { dbConfig } from "./config.js";

const db = mysql.createPool({
  ...dbConfig,
  charset: "utf8mb4",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default db;
