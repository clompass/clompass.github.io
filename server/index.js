/* Import dependencies */
const F = require("fnct");
const fs = require("fs");
const path = require("path");
const express = require("express");
const WebSocketServer = require("ws").Server
const puppeteer = require("puppeteer");

const app = express();
const port = 3000;

/* Allow access to files */
app.use("/public", express.static(path.join(__dirname, "../")));
app.use("/", express.static(path.join(__dirname, "client")));

/* Redirect to index file */
app.get('/', (req, res) => {
  res.send(fs.readFileSync(path.join(__dirname, "./client/index.html")).toString());
});

/* Set up server */
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});


/* Websocket communication */
const wss = new WebSocketServer({port: 8081}); wss.on('connection', (ws) => {
  ws.on("message", async (msg) => {
    msg = JSON.parse(msg);
    if (msg.type == "GET") {
      if (msg.name == "timetable") {
        timetable = await getTimetable(msg.username, msg.password);
        ws.send(JSON.stringify({
          type: "RETURN",
          name: "timetable",
          time: Date.now(),
          data: timetable,
        }));
      }
    }
  });
  ws.on("end", () => {
    console.error("Connection ended...");
  });
});


/* Get timetable from browser */
async function getTimetable(username, password) {
  console.log("Opening Browser...");
  browser = await puppeteer.launch({headless: true, defaultViewport: null, args: ['--start-maximized']});
  [page] = await browser.pages();
  console.log("Opening Page...");
  await page.goto("https://lilydaleheights-vic.compass.education/");

  console.log("Filling username and password...");
  await page.$$eval("#username", (el, username) => {
    el[0].value = username;
  }, username);
  await page.$$eval("#password", (el, password) => {
    el[0].value = password;
  }, password);

  console.log("Logging in...");
  await page.$eval("#button1", el => {
    el.disabled = false;
    el.click();
  });
  await page.waitForNavigation();

  console.log("Fetching subjects...");
  texts = await page.evaluate(() => {
    els = document.querySelectorAll(".ext-evt-bd");
    texts = [];
    for (i = 0; i < els.length; i++) {
      texts.push(els[i].innerText);
    }
    return (texts);
  });

  subjects = [];
  for (i = 0; i < texts.length; i++) {
    a = texts[i].split(": ");
    b = a[1].split(" - ");
    subjects.push({
      time: a[0],
      code: b[1],
      room: b[2],
      teacher: b[3],
    });
  }
  browser.close();

  return subjects;
}