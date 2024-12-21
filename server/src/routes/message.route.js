const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const {getUsersSidebar, getMessages, sendMessage} = require("../controllers/message.controller");
const messageRouter = express.Router();

messageRouter.get("/users", authMiddleware, getUsersSidebar);
messageRouter.get("/:id", authMiddleware, getMessages);
messageRouter.post("/send/:id", authMiddleware, sendMessage);

module.exports = messageRouter;