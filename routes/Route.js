import express from "express";
import { register, login, logout } from "../controllers/UsersController.js";
import { createForm,  getForms } from "../controllers/FormController.js";
import authSession from "../middleware/auth_session.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/form", authSession, createForm);
router.get("/form", authSession, getForms); // 👈 Tambahkan ini


export default router;
