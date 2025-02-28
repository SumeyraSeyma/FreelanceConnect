import User from "../models/userModel.js";
import { generateToken } from "../lib/utils.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const { fullName, email, password, role } = req.body;

  try {
    if (!fullName || !email || !password || !role) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password should be at least 6 characters long" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);


    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      role,
    });

    if (newUser) {
      await newUser.save();
      // token generation
      generateToken(newUser._id, res);

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
      });
    }
  } catch (error) {
    console.error("Error in signup route:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateToken(user._id, res);
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error("Error in login route:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logout route:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};
