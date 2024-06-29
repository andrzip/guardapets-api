import express from "express";
import userRoutes from "./routes/users.js";
import cors from "cors";

const port = process.env.PORT || 3001

const app = express();

app.use(express.json());
app.use(cors());

app.use("/users", userRoutes);

app.listen(port, () => {
    console.log(`✅ - Servidor Online! PORT -> [${port}]`);
});