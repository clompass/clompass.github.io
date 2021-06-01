var day;
var week;
function init() {
  d = new Date();
  day = d.getDay();
  week = d.getWeek() % 2;

  timetable.init();
}

/* Timetable */
timetable = {};
timetable.init = function () {
  index = day + week * 7;
  codes = user.subjects[index];
  doc.id("timetable").innerHTML = "";
  for (i = 0; i < codes.length; i++) {
    sbj = subjects[codes[i]];
    time = times.periods[i];
    time = [parseInt(time.s(0, 2)), time.s(2, -1)];
    if (time[0] > 13) {
      time[0] -= 12;
    }
    time = time.join(":");
    room = sbj.room;
    code = codes[i];

    doc.id("timetable").innerHTML += `
      <article class="timetable item">
        <h1>
          ${time} - ${code} - ${room}
        </h1>
      </article>
    `;
  }
}