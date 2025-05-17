import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "", // или твой пароль
  database: "coffee-shop",
});

export default db;
