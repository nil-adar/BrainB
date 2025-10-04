import express from "express";
import {
  login,
  register,
  resetInit,
  resetComplete,
} from "../controllers/authController";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/reset-password/init", resetInit);
router.post("/reset-password/complete", resetComplete);

export { router as authRouter };
