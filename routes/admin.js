import express from "express";
import {
    getWaitingAnimals, denyAnimal,
    acceptAnimal, updateAnimal
} from "../controllers/admin.js";
import { ipRestrictionMiddleware } from "../middlewares/ipRestriction.js";

const router = express.Router();
router.use(ipRestrictionMiddleware);

router.get("/", getWaitingAnimals);
router.put("/accept/:id", acceptAnimal);
router.delete("/deny/:id", denyAnimal);
router.put("/update/:id", updateAnimal);

export default router;