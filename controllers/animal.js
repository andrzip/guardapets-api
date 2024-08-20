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
    const sqlInsertAnimal = "INSERT INTO animals (`animal_name`, `animal_type`, `animal_age`, `animal_size`, `animal_gender`, `animal_desc`, `animal_picurl`) VALUES (?)";

    const animalValues = [
        req.body.animal_name,
        req.body.animal_type,
        req.body.animal_age,
        req.body.animal_size,
        req.body.animal_gender,
        req.body.animal_desc,
        req.body.animal_picurl
    ];

    db.query(sqlInsertAnimal, [animalValues], (err, data) => {
        if (err) return res.json(err);

        const animalId = data.insertId; // ID do animal recém-inserido
        const userId = req.body.user_id; // ID do usuário ao qual o animal será vinculado

        console.log(data);
        console.log("ANIMALID: " + animalId);
        console.log("USERID: " + userId);

        // Inserção do vínculo na tabela registry
        const sqlRegisterAnimal = "INSERT INTO registry (`user_id`, `animal_id`, `adoption_date`) VALUES (?)";

        const registryValues = [
            userId,
            animalId,
            new Date() // Data e hora atual para adoption_date
        ];

        db.query(sqlRegisterAnimal, registryValues, (err) => {
            if (err) return res.json(err);
            return res.status(200).json("Animal criado e vinculado ao usuário!");
        });
    });
}

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
