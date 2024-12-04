import bcrypt from "bcrypt";
import { db } from "../utils/db.js";
import {
  generateToken,
  setTokenCookie,
  verifyToken,
} from "../services/token.js";

// Função auxiliar para enviar resposta de erro
const sendErrorResponse = (res, message, status = 500) => {
  console.log("[ERRO BACKEND] -> ", res);
  return res.status(status).json({ error: message });
};

// Função de login com comparação de senha hash
export const getUser = (req, res) => {
  const sql = "SELECT * FROM users WHERE `user_email` = ?";
  const { user_email, user_password } = req.body;

  db.query(sql, [user_email], async (error, userData) => {
    if (error) {
      return res.status(500).json({ message: "Erro interno ao recuperar usuário" });
    }

    if (userData.length === 0) {
      return res.status(401).json({ message: "Credenciais de login incorretas" });
    }

    const validPassword = await bcrypt.compare(user_password, userData[0].user_password);
    if (!validPassword) return res.status(401).json({ message: "Credenciais de login incorretas!" });

    const accessToken = generateToken(userData[0]);
    setTokenCookie(res, accessToken);
    return res.status(200).json({ message: "Login realizado com sucesso" });
  });
};


// Função de cadastro com hash de senha
export const addUser = async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.user_password, 10);
  const sql = "INSERT INTO users (`user_name`, `user_email`, `user_password`, `user_phone`, `user_cpf`, `user_birthdate`, `user_address`, `user_state`, `user_city`, `user_cep`) VALUES (?)";

  const values = [
    req.body.user_name,
    req.body.user_email,
    hashedPassword,
    req.body.user_phone,
    req.body.user_cpf,
    req.body.user_birthdate,
    req.body.user_address,
    req.body.user_state,
    req.body.user_city,
    req.body.user_cep
  ];

  db.query(sql, [values], (err) => {
    if (err) return console.log("ERRO ADD USER ->", err);
    return res.status(200).json("Usuário criado!");
  });
};

// Atualizar usuário
export const updateUser = (req, res) => {
  const fieldsToUpdate = [];
    const values = [];

    const updatableFields = [
        "user_name",
        "user_email",
        "user_password",
        "user_phone",
        "user_cpf",
        "user_birthdate",
        "user_address",
        "user_state",
        "user_city",
        "user_cep",
    ];

    updatableFields.forEach((field) => {
        if (req.body[field] !== undefined) {
            fieldsToUpdate.push(`${field} = ?`);
            values.push(req.body[field]);
        }
    });

    if (fieldsToUpdate.length === 0) return res.status(400).json({ message: "Nenhum campo para atualizar." });

    const sql = `UPDATE users SET ${fieldsToUpdate.join(", ")} WHERE user_id = ?`;
    values.push(req.params.id);

    db.query(sql, values, (err) => {
        if (err) return res.status(500).json({ message: "Erro ao atualizar animal", details: err });
        return res.status(200).json("Usuário atualizado com sucesso!");
    });
};

// Deletar usuário
export const deleteUser = (req, res) => {
  const sql = "DELETE FROM users WHERE `user_id` = ?";

  db.query(sql, [req.params.id], (err) => {
    if (err) return sendErrorResponse(res, "Erro ao deletar usuário");
    return res.status(200).json("Usuário deletado!");
  });
};

// Obter perfil de usuário
export const getProfile = (req, res) => {
  const userSql = `SELECT * FROM users WHERE user_id = ?`;
  const animalsSql = `
    SELECT a.*
    FROM registry r
    LEFT JOIN animals a ON r.animal_id = a.animal_id
    WHERE r.user_id = ? AND a.animal_avaliable = 1
  `;

  db.query(userSql, [req.params.id], (err, userData) => {
    if (err) return sendErrorResponse(res, "Erro ao recuperar usuário");
    db.query(animalsSql, [req.params.id], (err, animalsData) => {
      if (err) return sendErrorResponse(res, "Erro ao recuperar animais");
      return res.status(200).json({ user: userData[0], animals: animalsData });
    });
  });
};

// Verificar token do usuário
export const verifyUserToken = (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return sendErrorResponse(res, "Usuário não autenticado", 401);
  }

  try {
    const decoded = verifyToken(token);
    return res.status(200).json({ user: decoded });
  } catch (error) {
    return sendErrorResponse(res, "Token inválido ou expirado", 401);
  }
};

// Logout
export const logOut = (req, res) => {
  res.clearCookie("token", { path: "/" });
  return res.status(200).json({ message: "Logout realizado com sucesso" });
};
