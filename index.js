import express from "express";
import userRoutes from "./routes/users.js";
import animalRoutes from "./routes/animals.js";
import cors from "cors";
import dotenv from "dotenv/config.js"

const port = process.env.PORT

const app = express();

app.use(express.json());
app.use(cors());

app.use("/users", userRoutes);
app.use("/animals", animalRoutes);

app.listen(port, () => {
    console.log(`✅ - Servidor Online! PORT -> [${port}]`);
});
