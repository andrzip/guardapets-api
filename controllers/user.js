import { db } from "../db.js";

export const getUser = (req, res) => {
    const sql = "SELECT * FROM users WHERE `email` = ? AND `password` = ?"

    const values = [
        req.body.email,
        req.body.password
    ]

    db.query(sql, values, (err, data) => {
        if (err) return res.json(err);
        else if (data.length > 0) return res.status(200).json("Login realizado!");
        else return res.status(401).json("Credenciais incorretas!");
    })
}

export const getUsers = (req, res) => {
    const sql = "SELECT * FROM users";

    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json(data);
    });
}

export const addUser = (req, res) => {
    const sql = "INSERT INTO users (`name`, `email`, `password`, `phone`, `birthdate`, `address`, `state`, `city`) VALUES (?)";

    const values = [
        req.body.name,
        req.body.email,
        req.body.password,
        req.body.phone,
        req.body.birthdate,
        req.body.address,
        req.body.state,
        req.body.city
    ];

    db.query(sql, [values], (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json("Usuário criado!");
    });
}

export const updateUser = (req, res) => {
    const sql = "UPDATE users SET `name` = ?, `email` = ?, `password` = ?, `phone` = ?, `birthdate` = ?, `address` = ?, `state` = ?, `city` = ? WHERE `user_id` = ?";

    const values = [
        req.body.name,
        req.body.email,
        req.body.password,
        req.body.phone,
        req.body.birthdate,
        req.body.address,
        req.body.state,
        req.body.city
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