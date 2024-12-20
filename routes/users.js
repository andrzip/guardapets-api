import express from "express";
import { getUser, addUser, updateUser, deleteUser, getProfile, verifyUserToken, logOut } from "../controllers/user.js";

const router = express.Router();

router.post("/signin", getUser);
router.post("/signup", addUser);
router.put("/edit/:id", updateUser);
router.delete("/delete/:id", deleteUser);
router.get("/profile/:id", getProfile);
router.get("/verify-token", verifyUserToken);
router.get("/logout", logOut);

export default router;