import bcrypt from "bcrypt"
import crypto from "crypto"
import jwt from "jsonwebtoken"
import nodemailer from "nodemailer"
import UserModel from "../models/user.model.js"

export const registerUser = async (req, res) => {
    try {
        const { name, email, password, height, weight, age, gender } = req.body

        const existingUser = await UserModel.findOne({ email })

        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exist" })
        }

        const hashedPassword = await bcrypt.hash(password, Number(process.env.HASH_ROUND) || 10)
        const verificationToken = crypto.randomBytes(32).toString("hex")

        const newUser = await UserModel.create({ name, email, password: hashedPassword, height, weight, age, gender, verificationToken })

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            }
        })

        const verifyUrl = `${process.env.BACKEND_URL}/api/users/verify/${verificationToken}`

        await transporter.sendMail({
            from: `"MediFoodie" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Verify your email",
            html: `<p>Hello ${name},</p>
                   <p>Click the link below to verify your email:</p>
                   <a href="${verifyUrl}">Verify</a>`,
        })

        res.status(200).json({ success: true, message: "Successfully registered, Check your email for verification link" })
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err });
    }
}

export const verifyMail = async (req, res) => {
    try {
        const { token } = req.params

        const user = await UserModel.findOne({ verificationToken: token })

        if (!user) {
            return res.status(400).json({ message: "Invalid token" })
        }

        user.isVerified = true
        user.verificationToken = null

        await user.save()

        res.status(200).json({ success: true, message: "Email verify successfully, You can login now" })
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err });
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Invalid Credentials" });
        }

        const user = await UserModel.findOne({ email })

        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        if (!user.isVerified) {
            return res.status(403).json({ success: false, message: "Please verify your email first" });
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid Credentials" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        )

        res.status(200).json({ success: true, message: "User logged in successfully", token, user: { id: user._id, name: user.name, email: user.email, role: user.role } })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err });
    }
}

export const getUserProfile = async (req, res) => {
    try {
        const user = req.user;
        res.status(200).json({ success: true, message: "User data fetched", user })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err });
    }
}