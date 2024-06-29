import mysql from "mysql";

export const db = mysql.createConnection({
    host: process.env.MYSQLHOST || "localhost",
    user: process.env.POSTGRES_USER || "root",
    password: process.env.MYSQLPASSWORD || "root",
    database: process.env.MYSQLDATABASE ||"guardapet_database",
    port: "3306"
});

db.connect((err) => {
    if (err) {
        console.error('❌ - MYSQL Erro de Conexão:\n', err.message);
        return;
    }
    console.log(`✅ - Database Conectada! HOST -> [${process.env.MYSQLHOST}]`);
});