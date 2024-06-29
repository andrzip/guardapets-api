import mysql from "mysql";

export const db = mysql.createConnection({
    host: process.env.MYSQLHOST,
    user: process.env.POSTGRES_USER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT
});

db.connect((err) => {
    if (err) {
        console.error('❌ - MYSQL Erro de Conexão:\n', err.message);
        return;
    }
    console.log(`✅ - Database Conectada! HOST -> [${process.env.MYSQLHOST}]`);
});