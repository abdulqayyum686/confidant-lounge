const http = require("http");
const express = require("express");
// const app = express();
require("events").EventEmitter.prototype._maxListeners = 100;
const app = require("./app");
var cors = require("cors");

const userRouterFile = require("./api/routes/users");
const gameRouterFile = require("./api/routes/game");

///cors issuenpm start
app.use(cors(
  {
    origin:"*"
  }
));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    // origin: 'https://www.helpros.app/api/',
    // methods: ['GET', 'POST', 'PUT', 'DELETE'],
    // credentials: true,
  },
});

userRouterFile.userRouter(io);
gameRouterFile.gameRouter(io);

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});

const port = process.env.port || 6002;
server.listen(port, "0.0.0.0", () => {
  console.log(`Server Started At PORT : ${port} {my-session  Project Backend}`);
});

module.exports = server;
