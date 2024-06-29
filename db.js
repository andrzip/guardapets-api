import mysql from "mysql";

export const db = mysql.createConnection({
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    port: "3306"
});

db.connect((err) => {
    if (err) {
        console.error('❌ - MYSQL Erro de Conexão:\n', err.message);
        return;
    }
    console.log(`✅ - Database Conectada! HOST -> [${process.env.POSTGRES_HOST}]`);
});