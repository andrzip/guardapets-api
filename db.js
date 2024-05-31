import mysql from "mysql";

export const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    port: "3306",
    database: "guardapet_database"
});

db.connect((err) => {
    if (err) {
        console.error('Erro conectando ao MySQL:', err);
        return;
    }
    console.log('Database conectada!');
});