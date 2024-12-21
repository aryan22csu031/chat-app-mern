const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/jwt.utils");

const signup = async (req, res) => {
  try {
    const { fullName, email, password, profilePic } = req.body;
    if (password.length < 6) {
      return res.status(400).json({
        success: "false",
        message: "password should be at least 8 characters",
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: "false",
        message: "user already exists",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      fullName,
      email,
      profilePic,
      password: hashedPassword,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      return res.status(201).json({
        success: "true",
        message: "user created successfully",
        user: {
          fullName: fullName,
          email: email,
          profilePic: profilePic,
        },
      });
    } else {
      return res.status(400).json({
        success: "false",
        message: "error in creating user",
      });
    }
  } catch (err) {
    return res.status(404).json({
      success: "false",
      message: "error in signup controller",
      error: err.message || err,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: "false",
        message: "user not found",
      });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(404).json({
        success: "false",
        message: "invalid credentials",
      });
    }
    generateToken(user._id, res);
    return res.status(200).json({
      success: "true",
      message: "user logged in successfully",
      user: {
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
      },
    });
  } catch (err) {
    return res.status(404).json({
      success: "false",
      message: "error in login controller",
      err,
    });
  }
};

const logout = (req, res) => {
  try {
    res.cookie("jwt", "", {
        maxAge:0
    });
    return res.status(200).json({
        success: "true",
        message: "user logged out successfully",
    });
  } catch (err) {
    return res.status(404).json({
      success: "false",
      message: "error in logout controller",
      err,
    });
  }
};

module.exports = {
  signup,
  login,
  logout,
};
