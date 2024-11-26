import { db } from "../utils/db.js";
import { verifyToken } from "../services/token.js";
import cloudinary from "../utils/cloudinary.js";

// Função para obter todos os animais
export const getAnimals = (req, res) => {
  const { cep, name, type, age, size, gender } = req.query;
  let sql = `
    SELECT a.*, u.user_name, u.user_cep, u.user_city, u.user_state
    FROM animals a
    LEFT JOIN registry r ON a.animal_id = r.animal_id
    LEFT JOIN users u ON r.user_id = u.user_id
    WHERE a.animal_avaliable = 1
  `;
  let filters = [];

  if (cep) {
    sql += ` AND u.user_cep = ?`;
    filters.push(cep);
  }
  
  if (name) {
    sql += ` AND a.animal_name LIKE ?`;
    filters.push(`%${name}%`);
  }
  
  if (type) {
    sql += ` AND a.animal_type = ?`;
    filters.push(type);
  }
  
  if (age) {
    sql += ` AND a.animal_age = ?`;
    filters.push(age);
  }

  if (size) {
    sql += ` AND a.animal_size = ?`;
    filters.push(size);
  }

  if (gender) {
    sql += ` AND a.animal_gender = ?`;
    filters.push(gender);
  }

  db.query(sql, filters, (err, data) => {
    if (err) return res.status(500).json({ message: "Erro ao obter animais", details: err });
    return res.status(200).json(data);
  });
};

// Função para obter animais pelo id
export const getAnimal = (req, res) => {
  const sql = `
    SELECT a.*, u.user_name, u.user_email, u.user_phone, u.user_city, u.user_state, u.user_address
    FROM animals a
    LEFT JOIN registry r ON a.animal_id = r.animal_id
    LEFT JOIN users u ON r.user_id = u.user_id
    WHERE a.animal_id = ?
  `;

  db.query(sql, [req.params.id], (err, data) => {
    if (err) return res.status(500).json({ message: "Erro ao obter animal", details: err });
    if (data.length === 0) return res.status(404).json({ message: "Animal não encontrado" });

    const result = data.map(animal => ({
      ...animal,
      user_phone: animal.user_phone || null,
      user_city: animal.user_city || null,
      user_state: animal.user_state || null,
      user_address: animal.user_address || null,
    }));

    return res.status(200).json(result);
  });
};

// Função para adicionar um novo animal e vinculá-lo a um usuário
export const addAnimal = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Usuário não autenticado", details: err });

  try {
    const decoded = verifyToken(token);
    const userId = decoded.user_id;

    const insertAnimalQuery = `INSERT INTO animals (animal_name, animal_age, animal_type, animal_size, animal_gender, animal_desc, animal_picurl) VALUES (?)`;

    let animalData = [
      req.body.animal_name,
      req.body.animal_age,
      req.body.animal_type,
      req.body.animal_size,
      req.body.animal_gender,
      req.body.animal_desc,
      "",
    ];

    try {
      const result = await cloudinary.uploader.upload(req.file.path);
      animalData[6] = result.url;
    } catch (err) {
      return res.status(500).json({ message: "Erro ao fazer o upload da imagem", details: err });
    }

    db.query(insertAnimalQuery, [animalData], (err, result) => {
      if (err) return res.status(500).json({ message: "Erro ao inserir animal", details: err });

      const animalId = result.insertId;
      const registerAnimalQuery = `INSERT INTO registry (user_id, animal_id, adoption_date) VALUES (?, ?, ?)`;
      const registryData = [userId, animalId, new Date()];

      db.query(registerAnimalQuery, registryData, (err) => {
        if (err) {
          return res.status(500).json({ message: "Erro ao registrar animal", details: err });
        }
        return res.status(200).json("Animal criado e vinculado ao usuário!");
      });
    });
  } catch (err) {
    return res.status(401).json({ message: "Ocorreu um erro ao adicionar o animal", details: err });
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
    if (err) return res.status(500).json({ message: "Erro ao atualizar animal", details: err });
    return res.status(200).json("Animal atualizado!");
  });
};

// Função para deletar um animal
export const deleteAnimal = (req, res) => {
  const sqlDeleteRegistry = "DELETE FROM registry WHERE `animal_id` = ?";

  db.query(sqlDeleteRegistry, [req.params.id], (err) => {
    if (err) return res.status(500).json({ message: "Erro ao deletar registros", details: err  });
    
    const sqlDeleteAnimal = "DELETE FROM animals WHERE `animal_id` = ?";

    db.query(sqlDeleteAnimal, [req.params.id], (err) => {
      if (err) return res.status(500).json({ message: "Erro ao deletar animal", details: err });
      return res.status(200).json({ message: "Animal e registros associados deletados!" });
    });
  });
};