import express from "express";
import { getAnimals, getAnimal, addAnimal, updateAnimal, deleteAnimal } from "../controllers/animal.js";

const router = express.Router();

router.get("/list", getAnimals);
router.post("/view", getAnimal);
router.post("/add", addAnimal);
router.put("/edit/:id", updateAnimal);
router.delete("/delete/:id", deleteAnimal);

export default router;
