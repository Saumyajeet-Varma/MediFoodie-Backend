import { Router } from "express"
import { getUserProfile, loginUser, registerUser, verifyMail } from "../controllers/user.controller.js"
import authMiddleware from "../middlewares/auth.middleware.js"

const router = Router()

router.post("/register", registerUser)

router.get("/verify/:token", verifyMail)

router.post("/login", loginUser)

router.get("/profile", authMiddleware, getUserProfile)

export default router