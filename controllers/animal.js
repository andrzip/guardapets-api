import { db } from "../db.js";

// Função para obter todos os animais
export const getAnimals = (req, res) => {
    const sql = "SELECT * FROM animals";

    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json(data);
    });
}

// Função para obter um animal específico pelo ID
export const getAnimal = (req, res) => {
    const sql = "SELECT * FROM animals WHERE `animal_id` = ?";

    db.query(sql, [req.params.id], (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json(data);
    });
}

// Função para adicionar um novo animal e vinculá-lo a um usuário
export const addAnimal = (req, res) => {
    const insertAnimalQuery = "INSERT INTO animals (`animal_name`, `animal_type`, `animal_age`, `animal_size`, `animal_gender`, `animal_desc`, `animal_picurl`) VALUES (?)";
    const animalData = [
        req.body.animal_name,
        req.body.animal_type,
        req.body.animal_age,
        req.body.animal_size,
        req.body.animal_gender,
        req.body.animal_desc,
        req.body.animal_picurl
    ];

    // Insere o animal e verifica o resultado da inserção
    db.query(insertAnimalQuery, [animalData], (err, result) => {
        if (err) return res.json(err);

        // Recupera o ID do animal recém-inserido
        const getAnimalIdQuery = "SELECT LAST_INSERT_ID() AS animal_id"; // Pode não funcionar bem com UUID
        db.query(getAnimalIdQuery, (err, data) => {
            if (err) return res.json(err);

            const animalId = data[0].animal_id; // Confere se o ID é correto

            console.log("ID DO ANIMAL -> " + animalId);
            console.log("ID DO USUARIO -> " + req.body.user_id);

            const registerAnimalQuery = "INSERT INTO registry (`user_id`, `animal_id`, `adoption_date`) VALUES (?)";
            const registryData = [
                req.body.user_id,
                animalId,
                new Date()
            ];

            db.query(registerAnimalQuery, [registryData], (err) => {
                if (err) return res.json(err);
                return res.status(200).json("Animal criado e vinculado ao usuário!");
            });
        });
    });
};


// Função para atualizar um animal existente
export const updateAnimal = (req, res) => {
    const sql = "UPDATE animals SET `animal_name` = ?, `animal_type` = ?, `animal_age` = ?, `animal_size` = ?, `animal_gender` = ?, `animal_desc` = ?, `animal_picurl` = ?, `animal_avaliable` = ? WHERE `animal_id` = ?";

    const values = [
        req.body.animal_name,
        req.body.animal_type,
        req.body.animal_age,
        req.body.animal_size,
        req.body.animal_gender,
        req.body.animal_desc,
        req.body.animal_picurl,
        req.body.animal_avaliable
    ];

    db.query(sql, [...values, req.params.id], (err) => {
        if (err) return res.json(err);
        return res.status(200).json("Animal atualizado!");
    });
}

// Função para deletar um animal
export const deleteAnimal = (req, res) => {
    const animalId = req.params.id;

    // Deletar primeiro os registros na tabela registry
    const sqlDeleteRegistry = "DELETE FROM registry WHERE `animal_id` = ?";

    db.query(sqlDeleteRegistry, [animalId], (err) => {
        if (err) return res.json(err);

        // Agora deletar o animal da tabela animals
        const sqlDeleteAnimal = "DELETE FROM animals WHERE `animal_id` = ?";

        db.query(sqlDeleteAnimal, [animalId], (err) => {
            if (err) return res.json(err);
            return res.status(200).json("Animal e registros associados deletados!");
        });
    });
}
