import express from "express";
import dotenv from "dotenv";
import connectDB  from "./lib/db.js";
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

dotenv.config();
const PORT = process.env.PORT;

app.use("/api/auth", authRoutes );
app.use("/api/jobs", jobRoutes);
app.use("/api/messages", messageRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});


