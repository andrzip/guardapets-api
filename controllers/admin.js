import { db } from "../db.js";

export const getWaitingAnimals = (req, res) => {
    const sql = "SELECT * FROM animals WHERE `animal_avaliable` = 0";

    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json(data);
    });
}