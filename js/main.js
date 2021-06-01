/* Communicate with server */
var ws = new WebSocket("ws://127.0.0.1:8081");
ws.onerror = function (err) {
  console.error(err);
};
ws.onmessage = function (event) {
  event = JSON.parse(event.data);
  if (event.type == "RETURN") {
    if (event.name == "timetable") {
      console.log(event.data);
      if (event.data) {
        setTimetable(event.data);
      }
    }
  }
};
ws.onclose = function () {
  console.error("Connection is closed...");
}

/* Send login request to server */
function login() {
  console.log("Loading...");
  ws.send(JSON.stringify({
    type: "GET",
    name: "timetable",
    time: Date.now(),
    username: doc.id("username").value,
    password: doc.id("password").value,
  }));
}

function init() {
  setTimetable();
}

/* Format timetable in HTML */
function setTimetable(timetable) {
  if (!timetable) {
    timetable = Array.from({length: 4}, () => { });
  }
  doc.id("timetable").innerHTML = "";
  for (i = 0; i < timetable.length; i++) {
    doc.id("timetable").innerHTML += `
    <article>
      <h1>Time: {time}</h1>
      <h1>Code: {code}</h1>
      <h1>Room: {room}</h1>
      <h1>Teacher: {teacher}</h1>
    </article>
    `.format({
      time: "Unknown",
      code: "Unknown",
      room: "Unknown",
      teacher: "Unknown",
    });
  }
}