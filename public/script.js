t.init(document.querySelector(".ttt-container"));

var socket = io.connect(location.host);
socket.emit("join")