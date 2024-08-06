import mysql from "mysql2";

export const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "guardapet_database",
});

db.connect((err) => {
    if (err) {
        console.error('❌ - MYSQL Erro de Conexão:\n', err.message);
        return;
    }
    console.log(`✅ - Database Conectada! HOST -> [localhost]`);
});