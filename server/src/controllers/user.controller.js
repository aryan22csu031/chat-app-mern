const User = require("../models/user.model");
const cloudinary = require("../config/cloudinary");

const updateProfile = async (req, res) => {
  try {
    const { fullName, profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "profile picture is required" });
    }
    const uploaded = await cloudinary.uploader.upload(profilePic);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        fullName: fullName,
        profilePic: uploaded.secure_url,
      },
      {
        new: true,
      }
    );

    res.status(200).json({
        success: "true",
        message: "Profile updated successfully",
    });
  } catch (err) {}
};

const checkAuth = async (req,res) => {
    try{
        return res.status(200).json({
            success: "true",
            message: "User is authenticated",
            user: req.user
        })
    }catch(err){
        return res.status(401).json({
            success: "false",
            message: "error in user controller"
        })
    }
};

module.exports = { updateProfile, checkAuth };
