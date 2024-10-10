import jwt from "jsonwebtoken";

const expires = 60 * 60 * 24 * 30 * 1000;

export const generateToken = (userData) => {
  const payload = {
    user_id: userData.user_id,
    user_email: userData.user_email,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + expires / 1000,
  };

  const accessToken = jwt.sign(payload, process.env.JWT_KEY, {
    algorithm: "HS256",
  });
  return accessToken;
};

export const setTokenCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: expires,
  });
};

export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    return decoded;
  } catch (error) {
    throw new Error("Token inválido");
  }
};
