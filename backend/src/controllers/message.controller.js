import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { io, getReceiverSocketId } from "../lib/socket.js";

// Get users (for sidebar)
export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
    res.status(200).json(filteredUsers);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all messages between two users
export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 });

    // filter out deleted for me
    const filteredMessages = messages.filter(
      (msg) => !msg.deletedBy.includes(myId)
    );

    res.status(200).json(filteredMessages);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Send message
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    if (!text && !image) return res.status(400).json({ error: "Message cannot be empty" });

    let imageUrl = null;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text: text || "",
      image: imageUrl,
      createdAt: new Date(),
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete only for current user
export const deleteMessageForMe = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const message = await Message.findById(id);
    if (!message) return res.status(404).json({ error: "Message not found" });

    if (!message.deletedBy.includes(userId)) {
      message.deletedBy.push(userId);
      await message.save();
    }

    res.status(200).json({ success: true, messageId: id, deletedFor: "me" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete for everyone
export const deleteMessageForEveryone = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const message = await Message.findById(id);
    if (!message) return res.status(404).json({ error: "Message not found" });

    if (String(message.senderId) !== String(userId)) {
      return res.status(403).json({ error: "Only sender can delete for everyone" });
    }

    message.isDeletedForEveryone = true;
    await message.save();

    const receiverSocketId = getReceiverSocketId(message.receiverId.toString());
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("messageDeleted", { messageId: id, type: "everyone" });
    }
    const senderSocketId = getReceiverSocketId(userId.toString());
    if (senderSocketId) {
      io.to(senderSocketId).emit("messageDeleted", { messageId: id, type: "everyone" });
    }

    res.status(200).json({ success: true, messageId: id, deletedFor: "everyone" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
