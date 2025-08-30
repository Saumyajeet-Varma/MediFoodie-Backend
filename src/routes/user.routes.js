import { Router } from "express"
import { registerUser, verifyMail } from "../controllers/user.controller.js"

const router = Router()

router.post("/register", registerUser)
router.get("/verify/:token", verifyMail)

export default router