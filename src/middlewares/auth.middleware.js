import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(400).json({ success: false, message: "Authorization denied" })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await UserModel.findById(decoded.id).select("-password -verificationToken")

        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" })
        }

        if (!user.isVerified) {
            return res.status(400).json({ success: false, message: "User not verified" })
        }

        req.user = user

        next()
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err });
    }
}

export default authMiddleware