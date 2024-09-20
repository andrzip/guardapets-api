import express from "express";
import {
    getAllAnimals, denyAnimal,
    acceptAnimal, updateAnimal,
    deleteAnimal
} from "../controllers/admin.js";
import { ipRestrictionMiddleware } from "../middlewares/ipRestriction.js";

const router = express.Router();
router.use(ipRestrictionMiddleware);

router.get("/", getAllAnimals);
router.put("/accept/:id", acceptAnimal);
router.put("/deny/:id", denyAnimal);
router.delete("/delete/:id", deleteAnimal);
router.put("/update/:id", updateAnimal);

export default router;