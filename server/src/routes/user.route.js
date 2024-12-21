const express = require("express");
const userRouter = express.Router();
const {updateProfile, checkAuth} = require("../controllers/user.controller.js");
const authMiddleware = require("../middleware/auth.middleware.js");

userRouter.put("/update",authMiddleware, updateProfile);
userRouter.get("/check", authMiddleware, checkAuth);

module.exports = userRouter;