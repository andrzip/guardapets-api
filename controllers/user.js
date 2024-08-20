import { db } from "../db.js";
import jwt from "jsonwebtoken";

export const getUser = (req, res) => {
    const sql = "SELECT * FROM users WHERE `user_email` = ? AND `user_password` = ?";
    const { user_email, user_password } = req.body;

    const values = [user_email, user_password];

    db.query(sql, values, (error, userData) => {
        if (error) {
            return res.status(500).json({ error: "Falha ao recuperar usuário" });
        }

        if (userData.length === 0) {
            return res.status(401).json({ error: "Credenciais de login incorretas" });
        }

        const accessToken = jwt.sign({
            user_id: userData[0].user_id,
            user_email: userData[0].user_email
        },
            process.env.JWT_KEY
        );
        return res.status(200).json({ message: "Login realizado com sucesso", accessToken });
    });
}

export const getUsers = (req, res) => {
    const sql = "SELECT * FROM users";

    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json(data);
    });
}

export const addUser = (req, res) => {
    const sql = "INSERT INTO users (`user_name`, `user_email`, `user_password`, `user_phone`, `user_doc`, `user_birthdate`, `user_address`, `user_state`, `user_city`) VALUES (?)";

    const values = [
        req.body.user_name,
        req.body.user_email,
        req.body.user_password,
        req.body.user_phone,
        req.body.user_doc,
        req.body.user_birthdate,
        req.body.user_address,
        req.body.user_state,
        req.body.user_city
    ];

    db.query(sql, [values], (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json("Usuário criado!");
    });
}

export const updateUser = (req, res) => {
    const sql = "UPDATE users SET `user_name` = ?, `user_email` = ?, `user_password` = ?, `user_phone` = ?, `user_doc` = ?, `user_birthdate` = ?, `user_address` = ?, `user_state` = ?, `user_city` = ? WHERE `user_id` = ?";

    const values = [
        req.body.user_name,
        req.body.user_email,
        req.body.user_password,
        req.body.user_phone,
        req.body.user_doc,
        req.body.user_birthdate,
        req.body.user_address,
        req.body.user_state,
        req.body.user_city
    ];

    db.query(sql, [...values, req.params.id], (err) => {
        if (err) return res.json(err);
        return res.status(200).json("Usuário atualizado!");
    });
}

export const deleteUser = (req, res) => {
    const sql = "DELETE FROM users WHERE `user_id` = ?";

    db.query(sql, [req.params.id], (err) => {
        if (err) return res.json(err);
        return res.status(200).json("Usuário deletado!");
    });
}