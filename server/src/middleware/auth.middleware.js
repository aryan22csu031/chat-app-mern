const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    // console.log(token);
    
    if (!token) {
      return res.status(401).json({
        success: "false",
        message: "Unauthorized: no token provided",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({
        success: "false",
        message: "Unauthorized: invalid token",
      });
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: "false",
        message: "Unauthorized: user not found",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(404).json({
      success: "false",
      message: "Invalid token",
      error: err.message,
    });
  }
};

module.exports = authMiddleware;

