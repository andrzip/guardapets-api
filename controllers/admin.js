import { db } from "../db.js";

export const getWaitingAnimals = (req, res) => {
    const sql = "SELECT * FROM animals WHERE `animal_avaliable` = 0";

    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json(data);
    });
}

export const acceptAnimal = (req, res) => {
    const sql = "UPDATE animals SET `animal_avaliable` = 1 WHERE `animal_id` = ?";

    db.query(sql, [req.params.id], (err) => {
        if (err) return res.json(err);
        return res.status(200).json("Animal disponível");
    });
}

export const denyAnimal = (req, res) => {
    const sql = "DELETE FROM animals WHERE `animal_id` = ?";

    db.query(sql, [req.params.id], (err) => {
        if (err) return res.json(err);
        return res.status(200).json("Animal excluído");
    });
}

export const updateAnimal = (req, res) => {
    const sql = "UPDATE animals SET `animal_name` = ?, `animal_type` = ?, `animal_age` = ?, `animal_size` = ?, `animal_gender` = ?, `animal_desc` = ?, `animal_picurl` = ? WHERE `animal_id` = ?";

    db.query(sql, [...req.body, req.params.id], (err) => {
        if (err) return res.json(err);
        return res.status(200).json("Animal atualizado");
    });
}