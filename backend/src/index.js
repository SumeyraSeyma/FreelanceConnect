import express from "express";
import dotenv from "dotenv";
import connectDB  from "./lib/db.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();
app.use(express.json());
dotenv.config();

const PORT = process.env.PORT;

app.use("/api/auth", authRoutes );

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});


