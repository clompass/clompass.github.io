var ws = new WebSocket("ws://127.0.0.1:8081");
ws.onerror = function (err) {
  console.error(err);
};
ws.onmessage = function (event) {
  event = JSON.parse(event.data);
  console.log(event.data);
};
ws.onclose = function () {
  console.error("Connection is closed...");
}

function run() {
  console.log("Loading...");
  ws.send(JSON.stringify({
    type: "GET",
    name: "timetable",
    time: Date.now(),
    username: doc.id("username").value,
    password: doc.id("password").value,
  }));
}