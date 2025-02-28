import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    budget: { type: Number, required: true },
    employer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    status: { type: String, enum: ["open", "closed"], default: "open" },
    createdAt: { type: Date, default: Date.now },
});

const Job = mongoose.model("Job", jobSchema);

export default Job;