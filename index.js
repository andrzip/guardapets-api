import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv/config.js";

import userRoutes from "./routes/users.js";
import animalRoutes from "./routes/animals.js";
import adminRoutes from "./routes/admin.js";

const port = process.env.PORT;

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());

app.use("/users", userRoutes);
app.use("/animals", animalRoutes);
app.use("/admin", adminRoutes);

app.listen(port, () => {
  console.log(`✅ - Servidor Online! PORT -> [${port}]`);
});
