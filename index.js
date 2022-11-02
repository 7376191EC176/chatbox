// to create a socket, establish connection, and enables communication by a chat box

let express = require("express");
let socket = require("socket.io");

// app setup
let app = express();

//creating a server
let server = app.listen(4000, function () {
  console.log("listening for requests on port 4000,");
});

// static files
app.use(express.static(__dirname));

// socket setup and pass server
let io = socket(server);
let userNameList = [];

//establishing connection
io.on("connection", (socket) => {
  console.log("made socket connection", socket.id);

  // handle chat event
  socket.on("chat", function (data) {
    socket.broadcast.emit("chat", data);
  });

  // handel typing event
  socket.on("typing", function (data) {
    socket.broadcast.emit("typing", data);
  });

  // handle connection establishment event
  socket.on("join", function (data) {
    socket.broadcast.emit("join", data);
    userNameList[socket.id] = data;
  });

  // handle connection termination event
  socket.on("disconnect", function () {
    socket.broadcast.emit("left", userNameList[socket.id]);
  });
});


