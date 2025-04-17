import express from "express";
import dotenv from "dotenv";
import connectDB  from "./lib/db.js";
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { app, server } from "./lib/socket.js";
import axios from "axios";

app.use(cookieParser());
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

app.post("/api/verify-captcha", async (req, res) => {
  const { captcha } = req.body;

  if (!captcha) {
    return res.json({ success: false, message: "CAPTCHA is required." });
  }

  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    return res.status(500).json({ success: false, message: "Missing CAPTCHA secret key" });
  }

  const verifyUrl = `https://www.google.com/recaptcha/api/siteverify`;

  try {
    const response = await axios.post(verifyUrl, null, {
      params: {
        secret: secretKey,
        response: captcha,
      }
    });

    console.log("Google reCAPTCHA response:", response.data); // Debug için log ekle

    if (response.data.success) {
      return res.json({ success: true });
    } else {
      return res.json({ success: false, message: "CAPTCHA verification failed." });
    }
  } catch (error) {
    console.error("Error during CAPTCHA verification:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
});


server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});


