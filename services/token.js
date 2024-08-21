import jwt from "jsonwebtoken";

const expires = 60 * 60 * 24 * 30 * 1000; // 30 dias em milissegundos

export const generateToken = (userData) => {
    const payload = {
        user_id: userData.user_id,
        user_email: userData.user_email,
        iat: Math.floor(Date.now() / 1000), // timestamp de criação
        exp: Math.floor(Date.now() / 1000) + expires / 1000, // timestamp de expiração em segundos
    };

    const accessToken = jwt.sign(payload, process.env.JWT_KEY, {
        algorithm: "HS256",
    });
    return accessToken;
};

export const setTokenCookie = (res, token) => {
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Somente em HTTPS em produção
        maxAge: expires, // 30 dias em milissegundos
    });
};

export const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        console.log("DECODED: ", decoded);
        return decoded;
    } catch (error) {
        throw new Error("Token inválido");
    }
};
