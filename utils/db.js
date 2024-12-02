import mysql from "mysql2";
import dotenv from "dotenv/config.js";

export const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
});

db.connect((err) => {
  if (err) {
    console.error("❌ - MYSQL Erro de Conexão:\n", err);
    return;
  }
  console.log(
    `✅ - Database Conectada! HOST -> [${process.env.MYSQLHOST}]`
  );
});
