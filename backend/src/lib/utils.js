import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid"; // UUID4 için eklendi

export const generateToken = (userId, res) => {
    const token = jwt.sign(
        { userId, jti: uuidv4() }, // UUID4 burada ekleniyor
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development",
    });

    return token;
};
