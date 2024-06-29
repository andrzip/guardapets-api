import mysql from "mysql";

export const db = mysql.createConnection({
    host: process.env.POSTGRES_HOST || "localhost",
    user: process.env.POSTGRES_USER || "root",
    password: process.env.POSTGRES_PASSWORD || "root",
    database: process.env.POSTGRES_DATABASE ||"guardapet_database",
    port: "3306"
});

db.connect((err) => {
    if (err) {
        console.error('❌ - MYSQL Erro de Conexão:\n', err.message);
        return;
    }
    console.log(`✅ - Database Conectada! HOST -> [${process.env.POSTGRES_HOST}]`);
});