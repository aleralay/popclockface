import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import * as util from "../common/utils";
import { memory } from "system";
import { battery } from "power";
import { display } from "display";

// Update the clock every minute
clock.granularity = "seconds";

let hourHand = document.getElementById("hours");
let minHand = document.getElementById("mins");
let secHand = document.getElementById("secs");

// Get a handle on the <text> element
const myLabel = document.getElementById("hoursl");
const minsLabel = document.getElementById("minsl");
// const memLabel = document.getElementById("meml");
const dayLabel = document.getElementById("dayl");
// const batLabel = document.getElementById("batteryl");
const memgage = document.getElementById("memg");
const batgage = document.getElementById("btry");

// batLabel.text = Math.floor(battery.chargeLevel) + "%";
batgage.sweepAngle = Math.floor(battery.chargeLevel / 2);


// Returns an angle (0-360) for the current hour in the day, including minutes
function hoursToAngle(hours, minutes) {
  let hourAngle = (360 / 12) * hours;
  let minAngle = (360 / 12 / 60) * minutes;
  return hourAngle + minAngle;
}

// Returns an angle (0-360) for minutes
function minutesToAngle(minutes) {
  return (360 / 60) * minutes;
}

// Returns an angle (0-360) for seconds
function secondsToAngle(seconds) {
  return (360 / 60) * seconds;
}

// Rotate the hands every tick
function updateClock() {
  let today = new Date();
  let hours = today.getHours() % 12;
  let mins = today.getMinutes();
  let secs = today.getSeconds();
  hourHand.groupTransform.rotate.angle = hoursToAngle(hours, mins);
  minHand.groupTransform.rotate.angle = minutesToAngle(mins);
  secHand.groupTransform.rotate.angle = secondsToAngle(secs);
  //---
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  } else {
    // 24h format
    hours = util.zeroPad(hours);
  }
  let dayOfM = util.zeroPad(today.getDate());
  mins = util.zeroPad(mins);
  secs = util.zeroPad(secs);
  myLabel.text = `${hours}`;
  minsLabel.text = `${mins}`;
  dayLabel.text = `${dayOfM}`;
}

// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
  updateClock();
}

memory.monitor.onmemorypressurechange = (evt) => {
  switch (memory.monitor.pressur) {
    case "critical":
      memgage.fill = "#FF0000";
      break;
    case "high":
      memgage.fill = "#FFA500";
      break;
    default:
      memgage.fill = "#7B68EE";
  }


}

display.onchange = (evt) => {
  // batLabel.text = Math.floor(battery.chargeLevel) + "%";
  batgage.sweepAngle = Math.floor(battery.chargeLevel / 2);
}

battery.onchange = (evt) => {
  // batLabel.text = Math.floor(battery.chargeLevel) + "%";
  batgage.sweepAngle = Math.floor(battery.chargeLevel / 2);
}