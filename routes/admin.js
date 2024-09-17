import express from "express";
import { getWaitingAnimals } from "../controllers/admin.js";
import { ipRestrictionMiddleware } from "../middlewares/ipRestriction.js";

const router = express.Router();
router.use(ipRestrictionMiddleware);

router.get("/", getWaitingAnimals);

export default router;