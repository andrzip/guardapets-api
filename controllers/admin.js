import { db } from "../utils/db.js";

export const getAllAnimals = (req, res) => {
    const sql = `
        SELECT a.*, u.user_city, u.user_state, u.user_address, u.user_cep
        FROM animals a
        LEFT JOIN registry r ON a.animal_id = r.animal_id
        LEFT JOIN users u ON r.user_id = u.user_id
    `;

    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json(data);
    });
}

export const acceptAnimal = (req, res) => {
    const sql = "UPDATE animals SET `animal_avaliable` = 1 WHERE `animal_id` = ?";

    db.query(sql, [req.params.id], (err) => {
        if (err) return res.json(err);
        return res.status(200).json("Animal disponível!");
    });
}

export const denyAnimal = (req, res) => {
    const sql = "UPDATE animals SET `animal_avaliable` = 0 WHERE `animal_id` = ?";

    db.query(sql, [req.params.id], (err) => {
        if (err) return res.json(err);
        return res.status(200).json("Animal negado!");
    });
}

export const deleteAnimal = (req, res) => {
    const sql = "DELETE FROM animals WHERE `animal_id` = ?";

    db.query(sql, [req.params.id], (err) => {
        if (err) return res.json(err);
        return res.status(200).json("Animal excluído!");
    });
}

export const updateAnimal = (req, res) => {
    const fieldsToUpdate = [];
    const values = [];

    const updatableFields = [
        "animal_name",
        "animal_type",
        "animal_age",
        "animal_size",
        "animal_gender",
        "animal_desc",
        "animal_picurl",
        "animal_avaliable",
    ];

    updatableFields.forEach((field) => {
        if (req.body[field] !== undefined) {
            fieldsToUpdate.push(`${field} = ?`);
            values.push(req.body[field]);
        }
    });

    if (fieldsToUpdate.length === 0) return res.status(400).json({ message: "Nenhum campo para atualizar." });

    const sql = `UPDATE animals SET ${fieldsToUpdate.join(", ")} WHERE animal_id = ?`;
    values.push(req.params.id);

    db.query(sql, values, (err) => {
        if (err) return res.status(500).json({ message: "Erro ao atualizar animal", details: err });
        return res.status(200).json("Animal atualizado com sucesso!");
    });
}