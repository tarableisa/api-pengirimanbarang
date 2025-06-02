import express from "express";
import { register, login, logout } from "../controllers/UsersController.js";
import {   createForm,getForms,getFormById, updateForm, uploadBukti,} from "../controllers/FormController.js";
import authSession from "../middleware/auth_session.js";

const router = express.Router();

// Middleware untuk otentikasi sesi
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// Rute untuk form
router.post("/form", authSession, uploadBukti, createForm);
router.get("/form", authSession, getForms);
router.get("/form/:id", authSession, getFormById); // ← tambahkan ini
router.put("/form/:id", authSession, uploadBukti, updateForm); // <— tambahkan ini


export default router;
