import { db } from "../utils/db.js";
import { verifyToken } from "../services/token.js";
import cloudinary from "../utils/cloudinary.js";

// Função para obter todos os animais
export const getAnimals = (req, res) => {
  const { cep } = req.params;
  let sql;

  if (cep) {
    sql = "SELECT * FROM animals WHERE `animal_avaliable` = 1 AND `animal_cep` = ?";
    db.query(sql, [cep], (err, data) => {
      if (err) return res.json(err);
      return res.status(200).json(data);
    });
  } else {
    sql = "SELECT * FROM animals WHERE `animal_avaliable` = 1";
    db.query(sql, (err, data) => {
      if (err) return res.json(err);
      return res.status(200).json(data);
    });
  }
};

// Função para obter animais pelo cep
export const getAnimal = (req, res) => {
  const sql = "SELECT * FROM animals WHERE `animal_cep` = ?";

  db.query(sql, [req.params.cep], (err, data) => {
    if (err) return res.json(err);
    return res.status(200).json(data);
  });
};

// Função para adicionar um novo animal e vinculá-lo a um usuário
export const addAnimal = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Usuário não autenticado" });

  try {
    const decoded = verifyToken(token);
    const userId = decoded.user_id;

    const insertAnimalQuery = `INSERT INTO animals (animal_name, animal_type, animal_age, animal_size, animal_address, animal_cep, animal_gender, animal_desc, animal_picurl) VALUES (?)`;

    let animalData = [
      req.body.animal_name,
      req.body.animal_type,
      req.body.animal_age,
      req.body.animal_size,
      req.body.animal_address,
      req.body.animal_cep,
      req.body.animal_gender,
      req.body.animal_desc,
      "",
    ];

    try {
      const result = await cloudinary.uploader.upload(req.file.path);
      animalData[8] = result.url;
    } catch (err) {
      return res.status(500).json({ error: "Erro ao fazer o upload da imagem", details: err });
    }

    db.query(insertAnimalQuery, [animalData], (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Erro ao inserir animal", details: err });
      }

      const animalId = result.insertId;
      const registerAnimalQuery = `INSERT INTO registry (user_id, animal_id, adoption_date) VALUES (?, ?, ?)`;
      const registryData = [userId, animalId, new Date()];

      db.query(registerAnimalQuery, registryData, (err) => {
        if (err) {
          return res.status(500).json({ error: "Erro ao registrar animal", details: err });
        }
        return res.status(200).json("Animal criado e vinculado ao usuário!");
      });
    });
  } catch (error) {
    return res.status(401).json({ error: "Ocorreu um erro ao adicionar o animal" });
  }
};
// Função para atualizar um animal existente
export const updateAnimal = (req, res) => {
  const sql =
    "UPDATE animals SET `animal_name` = ?, `animal_type` = ?, `animal_age` = ?, `animal_size` = ?, `animal_address` = ?, `animal_cep` = ?, `animal_gender` = ?, `animal_desc` = ?, `animal_picurl` = ?, `animal_avaliable` = ? WHERE `animal_id` = ?";

  const values = [
    req.body.animal_name,
    req.body.animal_type,
    req.body.animal_age,
    req.body.animal_size,
    req.body.animal_address,
    req.body.animal_cep, 
    req.body.animal_gender,
    req.body.animal_desc,
    req.body.animal_picurl,
    req.body.animal_avaliable,
  ];

  db.query(sql, [...values, req.params.id], (err) => {
    if (err) return res.json(err);
    return res.status(200).json("Animal atualizado!");
  });
};

// Função para deletar um animal
export const deleteAnimal = (req, res) => {
  // Deletar primeiro os registros na tabela registry
  const sqlDeleteRegistry = "DELETE FROM registry WHERE `animal_id` = ?";

  db.query(sqlDeleteRegistry, [req.params.id], (err) => {
    if (err) return res.json(err);

    // Agora deletar o animal da tabela animals
    const sqlDeleteAnimal = "DELETE FROM animals WHERE `animal_id` = ?";

    db.query(sqlDeleteAnimal, [req.params.id], (err) => {
      if (err) return res.json(err);
      return res.status(200).json("Animal e registros associados deletados!");
    });
  });
};
