// Make Connection
let socket = io.connect("http://localhost:4000");

// Query DOM
let message = document.getElementById("message");
let userName = document.getElementById("name");
let send = document.getElementById("send");
let output = document.getElementById("output");
let feedback = document.getElementById("feedback");

// Listen event where a user is loging in
document.getElementById("login-btn").addEventListener("click", () => {
  //if the User name is provided then the chatbox will open 
  if (userName.value.length != 0) {
    document.getElementById("login").style.display = "none";
    document.getElementById("free-chat").style.display = "block";
    document.body.style.backgroundImage = "url('./assets/background.png')";
    document.body.style.backgroundSize = "auto";
    document.getElementById("user-display").innerHTML = userName.value;
    socket.emit("join", userName.value);
  } 
  // if the username is not entered then alert will be displayed to enter the username 
  else {
    alert("Please enter valid user name");
  }
});

// On sending the message either by clicking send or enter then the data will be emited to display in other users system.
// In that users system it is displayed in different form.
send.addEventListener("click", function () {
  if (message.value.length != 0) {
    let currentDate = new Date(); // to fetch the current date and time
    // to display the current date
    document.getElementById("date").innerHTML =
      currentDate.getDate() +
      " " +
      new Date(currentDate).toLocaleString("en-US", { month: "short" }) +
      " " +
      currentDate.getFullYear(); 
    let displayTime = currentDate.getHours() + ":" + currentDate.getMinutes(); // to display the time which the message is send
    output.innerHTML +=
      "<p class = 'my-msg'>" +
      "<span id = 'you-color'>" +
      "you" +
      "</span>" +
      "<br>" +
      message.value +
      "<sub><sub style='float:right bottom'>" +
      displayTime +
      "</sub></sub>" +
      "</p>";
    // to emit the data for broadcasting
    socket.emit("chat", {
      message: message.value,
      userName: userName.value,
    });
    message.value = "";
  } 
  // if there's is no data for transmission then the alert will be made
  else {
    alert("Please send a message");
  }
});

// To listen to the event of keypress
message.addEventListener("keypress", function (event) {
  // if the key pressed is Enter, then the function is to send the message
  if (event.key == "Enter") {
    event.preventDefault();
    send.click();
  } 
  // if the user is typing the message, then the intimation is given to others users 
  else {
    socket.emit("typing", userName.value);
  }
});

// Listen for events to broadcast the message
socket.on("chat", function (data) {
  let currentDate = new Date(); // to fetch the live date
  document.getElementById("date").innerHTML =
    currentDate.getDate() +
    " " +
    new Date(currentDate).toLocaleString("en-US", { month: "short" }) +
    " " +
    currentDate.getFullYear(); // to display the current date
  let displayTime = currentDate.getHours() + ":" + currentDate.getMinutes(); // to display the time which the message is send
  feedback.innerHTML = "";
  // display the broadcasted message  
  output.innerHTML +=
    "<p class = 'others-msg'><strong>" +
    "<span id = 'other-color'>" +
    data.userName +
    "</span>" +
    "</strong>" +
    "<br>" +
    data.message +
    " " +
    "<sub><sub style='float:right bottom'>" +
    displayTime +
    "</sub></sub>" +
    "</p>";
});

// Broadcast that the user is typing
socket.on("typing", function (data) {
  feedback.innerHTML = "<p><em>" + data + " is typing a message...</em></p>";
});

// To intimate the chat users that a new user has joined the conversation
socket.on("join", function (data) {
  feedback.innerHTML = "";
  output.innerHTML += "<p>" + data + " joined the chat ...</p>";
});

// To initmate the chat users that a user has left the conversation 
socket.on("left", function (data) {
  if (data != null) {
    feedback.innerHTML = "";
    output.innerHTML += "<p>" + data + " left the chat ...</p>";
  }
});
