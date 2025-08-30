import { Router } from "express"
import { loginUser, registerUser, verifyMail } from "../controllers/user.controller.js"

const router = Router()

router.post("/register", registerUser)
router.get("/verify/:token", verifyMail)
router.post("/login", loginUser)

export default router