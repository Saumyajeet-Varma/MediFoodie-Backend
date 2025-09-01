import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
import connectDB from "./config/db.js"
import authRouter from "./routes/user.routes.js"

dotenv.config()

const app = express()

connectDB()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use("/api/users", authRouter)

app.get("/", (req, res) => {
    res.send("Server is running");
})

export default app