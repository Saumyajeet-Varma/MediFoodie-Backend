import mongoose from "mongoose"
import jwt from "jsonwebtoken"
// import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },

    password: {
        type: String,
        required: true,
        minlength: 6,
    },

    role: {
        type: String,
        enum: ["user", "doctor", "admin"],
        default: "user",
    },

    age: {
        type: Number,
        default: null,
    },

    gender: {
        type: String,
        enum: ["male", "female", "other"],
        default: "other",
    },

    healthCondition: {
        type: [String],
        default: [],
    },

    height: {
        type: Number,     // in cm
        required: true,
    },

    weight: {
        type: Number,     // in kg
        required: true,
    },

    activityLevel: {
        type: String,
        enum: ["low", "moderate", "high"],
        default: "moderate",
    },

    healthGoal: {
        type: String,
        enum: ["weight_loss", "weight_gain", "maintain"],
        default: "maintain",
    },

    verificationToken: {
        type: String,
        default: null,
    },

    isVerified: {
        type: Boolean,
        default: false,
    },

}, { timestamps: true })

// userSchema.statics.hashPassword = async function (password) {
//     return await bcrypt.hash(password, Number(process.env.HASH_ROUND) || 10)
// }

// userSchema.methods.isValidPassword = async function (password) {
//     return await bcrypt.compare(password, this.password)
// }

// userSchema.methods.generateJWT = function () {

//     return jwt.sign(
//         { id: this._id, email: this.email, role: this.role },
//         process.env.JWT_SECRET,
//         { expiresIn: process.env.JWT_EXPIRE || "1d" }
//     )
// }

userSchema.virtual("bmi").get(function () {

    if (this.height && this.weight) {

        const heightInMeters = this.height / 100
        const bmi = (this.weight / (heightInMeters * heightInMeters)).toFixed(2)

        return bmi
    }

    return null
})

userSchema.set("toObject", { virtuals: true })
userSchema.set("toJSON", {
    virtuals: true,
    transform: (doc, ret) => {
        delete ret.password
        return ret
    }
})

const User = mongoose.model("User", userSchema)

export default User