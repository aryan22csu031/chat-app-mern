const express = require("express");
const cookieParser = require("cookie-parser");
const connect_db = require("./config/db");
const authRoutes = require("./routes/auth.route.js");
const userRoutes = require("./routes/user.route.js");
const messageRouter = require("./routes/message.route.js");
const cors = require("cors");
const path = require("path");
const { app, server } = require("./config/socket.js");
require("dotenv").config();

const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/message", messageRouter);
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  connect_db();
});
