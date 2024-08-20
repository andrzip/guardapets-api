import express from "express";
import { getUsers, getUser, addUser, updateUser, deleteUser } from "../controllers/user.js";

const router = express.Router();

router.get("/list", getUsers);
router.post("/signin", getUser);
router.post("/signup", addUser);
router.put("/edit/:id", updateUser);
router.delete("/delete/:id", deleteUser)

export default router;