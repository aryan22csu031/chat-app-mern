const express = require("express");
const { signup, login, logout } = require("../controllers/auth.controller.js");
const { updateProfile } = require("../controllers/user.controller.js");
const authRouter = express.Router();

authRouter.post("/signup", signup)
authRouter.post("/login", login)
authRouter.post("/logout", logout)

module.exports = authRouter;