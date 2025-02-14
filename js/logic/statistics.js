import { getLocalStorageItem, setLocalStorageItem } from "../utils/storage.js";
import { createOrUpdateChart, createWPMChart } from "../utils/chart.js";

let pieCh;
let wpmCh;
let collapseInstance;

document.addEventListener("DOMContentLoaded", () => {
  const collapseElement = document.getElementById("performanceSummary");
  collapseInstance = new bootstrap.Collapse(collapseElement);
});

export function calculateStats(testText, longestCorrect, mistakeCount, time) {
  const overlap = findOverlap(longestCorrect, testText);

  const overlapChars = overlap.join(" ").length;

  const wpm = calculateWPM(overlap.length, time);
  const acc = calculateAcc(overlapChars, mistakeCount);
  togglePerformanceSummary();
  displayStats(wpm, overlapChars, mistakeCount, testText.length - longestCorrect.length, acc);
  document.getElementById("message").innerText = checkImprovement(wpm, acc);
  saveStats(wpm, overlapChars, mistakeCount, testText.length - longestCorrect.length, acc);
}

export function displayStats(wpm, corr, mist, left, acc) {
  drawWPMChart(wpm);
  drawAccChart(corr, mist, left);
  showStats(wpm, acc);
}

function toWordArr(text) {
  return text.match(/\b\w+(?:'\w+)?\b/g);
}

function findOverlap(longestCorrect, testText) {
  if (longestCorrect.length === 0) {
    return [];
  }

  let overlap = [];
  const user = toWordArr(longestCorrect);
  const total = toWordArr(testText);
  for (let i = 0; i < Math.min(user.length, total.length); i++) {
    if (user[i] === total[i]) {
      overlap.push(user[i]);
    } else {
      break;
    }
  }
  return overlap;
}

function calculateWPM(wordsAmount, timeLeft) {
  return Math.round((wordsAmount * 60) / (60 - timeLeft));
}

function calculateAcc(correct, mistakeCount) {
  return correct === 0 ? 0 : Math.round(((correct - mistakeCount) / correct) * 100);
}

function drawAccChart(corr, mist, left) {
  const ctx = document.getElementById("pie-chart").getContext("2d");
  pieCh = createOrUpdateChart(pieCh, ctx, "pie", {
    labels: ["Correct", "Mistakes", "Not Typed"],
    datasets: [{ data: [corr, mist, left], backgroundColor: ["#4CAF50", "#FF5733", "#FFC107"] }],
  });
}

function drawWPMChart(userWPM) {
  const ctx = document.getElementById("wpm-chart").getContext("2d");
  wpmCh = createWPMChart(wpmCh, ctx, userWPM);
}

function showStats(wpm, acc) {
  document.getElementById("wpm-rating").innerText = `${wpm} WPM`;
  document.getElementById("acc-rating").innerText = `${acc}%`;
}

function saveStats(currWPM, currCorrect, currMistakes, currLeft, currAcc) {
  let saveData = getLocalStorageItem("saveData") || [];

  saveData.push({
    date: new Date().toJSON().slice(0, 10),
    wpm: currWPM,
    acc: currAcc,
    corr: currCorrect,
    mist: currMistakes,
    left: currLeft,
  });

  saveMetrics(saveData);
  setLocalStorageItem("saveData", saveData);
}

export function togglePerformanceSummary() {
  document.getElementById("performanceSummary").style.display = "block";
  collapseInstance.show();
}

function saveMetrics(stats) {
  const metrics = stats.reduce(
    (accumulator, current) => {
      // Update sum for average calculation
      accumulator.aveWPM += current["wpm"];
      accumulator.aveAcc += current["acc"];

      // Update max values
      accumulator.maxWPM = Math.max(accumulator.maxWPM, current["wpm"]);
      accumulator.maxAcc = Math.max(accumulator.maxAcc, current["acc"]);

      return accumulator;
    },
    { aveWPM: 0, aveAcc: 0, maxWPM: -Infinity, maxAcc: -Infinity }
  );

  metrics.aveWPM = Math.round(metrics.aveWPM / stats.length, 1);
  metrics.aveAcc = Math.round(metrics.aveAcc / stats.length, 1);

  setLocalStorageItem("metrics", metrics);
}

function checkImprovement(currentWPM, currentAccuracy) {
  const metrics = getLocalStorageItem("metrics");

  if (metrics === null) {
    return "This is your first attempt!";
  }

  const averageWPM = parseInt(metrics.aveWPM);
  const averageAcc = parseInt(metrics.aveAcc);

  let resultMessage = "";

  if (currentWPM > averageWPM && currentAccuracy > averageAcc) {
    resultMessage = "Amazing! You've improved both your WPM and accuracy above the average!";
  } else if (currentWPM > averageWPM) {
    resultMessage = "Great job! You've improved your WPM compared to the average!";
  } else if (currentAccuracy > averageAcc) {
    resultMessage = "Good job! You've improved your accuracy compared to the average!";
  } else if (currentWPM === averageWPM && currentAccuracy === averageAcc) {
    resultMessage = "You're matching the average! Consistency is key!";
  } else {
    resultMessage = "Keep going! You can beat the average next time!";
  }

  return resultMessage;
}
