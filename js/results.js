import { displayStats, togglePerformanceSummary } from "./statistics.js";

document.addEventListener("DOMContentLoaded", () => {
  populateResults();
  populateMetrics();
});

function populateResults() {
  const saveData = JSON.parse(localStorage.getItem("saveData")) || [];

  const table = document.getElementById("resultsTable");
  const tbody = table.querySelector("tbody");

  saveData.reverse().forEach((item, index) => {
    let row = document.createElement("tr");
    const nr = saveData.length - index;
    row.innerHTML = `
    <td>${nr}</td>
    <td>${item["date"]}</td>
    <td>${item["wpm"]}</td>
    <td>${item["acc"]}</td>
    `;

    row.addEventListener("click", () => {
      togglePerformanceSummary();
      document.getElementById("stat-id").innerText = `Showing entry ${nr}`;
      displayStats(item["wpm"], item["corr"], item["mist"], item["left"], item["acc"]);
    });

    tbody.appendChild(row);
  });
}

function populateMetrics() {
  const metrics = JSON.parse(localStorage.getItem("metrics"));
  if (metrics) {
    document.getElementById("average-wpm").innerText = metrics.aveWPM;
    document.getElementById("best-wpm").innerText = metrics.maxWPM;
    document.getElementById("average-acc").innerText = metrics.aveAcc;
    document.getElementById("best-acc").innerText = metrics.maxAcc;
  }
}
