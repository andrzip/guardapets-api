import express from "express";
import upload from "../middlewares/multer.js";
import { getAnimals, getAnimal, addAnimal, updateAnimal, deleteAnimal, donorContact } from "../controllers/animal.js";

const router = express.Router();

router.get("/list/:cep?", getAnimals);
router.get("/view/:id", getAnimal);
router.post("/add", upload.single("animal_picurl"), addAnimal);
router.put("/edit/:id", updateAnimal);
router.delete("/delete/:id", deleteAnimal);
router.get("/donorContact/:id", donorContact);

export default router;
