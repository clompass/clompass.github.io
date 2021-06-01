const F = require("fnct");
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

user = fs.readFileSync(path.join(__dirname, "user.txt")).toString().split("\r\n");
async function run() {
  console.log("Opening Browser...");
  browser = await puppeteer.launch({headless: false, defaultViewport: null, args: ['--start-maximized']});
  [page] = await browser.pages();
  console.log("Opening Page...");
  await page.goto("https://lilydaleheights-vic.compass.education/");

  console.log("Filling username and password...");
  await page.$$eval("#username", (el, user) => {
    el[0].value = user[0];
  }, user);
  await page.$$eval("#password", (el, user) => {
    el[0].value = user[1];
  }, user);

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
  console.log(subjects);

  browser.close();
}
run();