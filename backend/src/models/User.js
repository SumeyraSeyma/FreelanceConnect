import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["freelancer", "employer"], required: true },
    createdAt : { type: Date, default: Date.now },
    bio: { type: String },
    skills: [{ type: String }],
    rating: { type: Number, default: 0 },
    image: { type: String },
});

const User = mongoose.model("User", userSchema);

export default User;