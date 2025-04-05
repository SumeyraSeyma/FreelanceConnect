import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId } from "../lib/socket.js";
import { io } from "../lib/socket.js";
import mongoose from "mongoose";

export const getAllUsers = async (req, res) => {
  try {
    // Get all users except the logged in user
    const users = await User.find({ _id: { $ne: req.user._id } }).select(
      "-password"
    );
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error in getAllUsers route:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json({ messages });
  } catch (error) {
    console.error("Error in getMessages route:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl = "";
    if (image) {
      const uploadedImage = await cloudinary.uploader.upload(image);
      imageUrl = uploadedImage.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(200).json({ newMessage: newMessage });
  } catch (error) {
    console.error("Error in sendMessage route:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getChatUsers = async (req, res) => {
  try {
    const userId = req.user?._id.toString();
    if (!userId) {
      throw new Error("User ID is missing or undefined");
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error(`Invalid ObjectId: ${userId}`);
    }

    const chatUsers = await Message.find({
      $or: [
        { senderId: new mongoose.Types.ObjectId(userId) },
        { receiverId: new mongoose.Types.ObjectId(userId) },
      ],
    })
      .populate("senderId", "fullName image")
      .populate("receiverId", "fullName image")
      .sort({ createdAt: -1 });

    const uniqueUserIds = [
      ...new Set(
        chatUsers.flatMap((msg) => [
          msg.senderId._id.toString(),
          msg.receiverId._id.toString(),
        ])
      ),
    ].filter((id) => id !== userId);

    const uniqueUsers = uniqueUserIds.map((id) => {
      const msg = chatUsers.find(
        (m) =>
          m.senderId._id.toString() === id || m.receiverId._id.toString() === id
      );
      return msg.senderId._id.toString() === id ? msg.senderId : msg.receiverId;
    });

    const sortedUsers = uniqueUsers.sort((a, b) => {
      const lastMessageA = chatUsers.find(
        (m) =>
          m.senderId._id.toString() === a._id.toString() ||
          m.receiverId._id.toString() === a._id.toString()
      );
      const lastMessageB = chatUsers.find(
        (m) =>
          m.senderId._id.toString() === b._id.toString() ||
          m.receiverId._id.toString() === b._id.toString()
      );
      return (
        new Date(lastMessageB.createdAt) - new Date(lastMessageA.createdAt)
      );
    });

    res.status(200).json({ users: sortedUsers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
