const Message = require("../models/message.model");
const User = require("../models/user.model");
const cloudinary = require("cloudinary");
const { getReceiverSocketId, io } = require("../config/socket.js");

const getUsersSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    // console.log(req.user);

    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } });

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: filteredUsers,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "error in message controller",
      error: err.message,
    });
  }
};

const getMessages = async (req, res) => {
  try {
    const userToChatId = req.params.id;
    const senderId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: senderId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: senderId },
      ],
    });

    res.status(200).json({
      success: true,
      message: "Messages fetched successfully",
      data: messages,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "error in message controller",
      error: err.message,
    });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;
    let imageUrl;
    if (image) {
      const uploadedResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadedResponse.secure_url;
    }

    const message = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await message.save();
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", message);
    }
    console.log(res);
    

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      message,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "error in message controller",
      error: err.message,
    });
  }
};

module.exports = { getUsersSidebar, getMessages, sendMessage };
