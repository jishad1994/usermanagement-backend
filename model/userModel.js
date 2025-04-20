import mongoose, { mongo } from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/\S+@\S+\.\S+/, "Please enter a valid email"],
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        match: [/^\d{10}$/, "Phone must be 10 digits"],
    },
    profileImage: { type: String },
    password: {
        type: String,
        required: true,
        match: [
            /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            "Password must be at least 8 characters and include 1 uppercase, 1 number, and 1 special character",
        ],
    },
    role: { type: String, enum: ["user", "admin"], default: "user" },
});

export default mongoose.model("User", userSchema);
