let pieCh;
let wpmCh;
let collapseInstance;

const globalWPM = {
  labels: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 120, 140, 160], // WPM bins
  datasets: [
    {
      label: "Typing Speed Distribution",
      data: [0.2, 1, 5, 15, 30, 25, 15, 8, 5, 3, 2, 1, 0.5, 0.2], // Simulated % of people at each WPM range
      borderColor: "blue",
      backgroundColor: "rgba(0, 0, 255, 0.2)",
      fill: true,
      tension: 0.4, // Smooth curve
    },
    {
      label: "Your typing speed", // Label for the red vertical line
      data: [], // No actual data
      borderColor: "red",
      borderWidth: 2,
      type: "line", // This is a line dataset but no actual points
    },
  ],
};

document.addEventListener("DOMContentLoaded", () => {
  // Select the collapse element
  const collapseElement = document.getElementById("performanceSummary");

  // Initialize Bootstrap Collapse
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
  if (correct === 0) {
    return 0;
  }
  const acc = ((correct - mistakeCount) / correct) * 100;
  return Math.round(acc);
}

function drawAccChart(corr, mist, left) {
  const ctx = document.getElementById("pie-chart").getContext("2d");

  if (pieCh) {
    pieCh.data.datasets[0].data = [corr, mist, left]; // Update data
    pieCh.update(); // Refresh chart
  } else {
    pieCh = new Chart(ctx, {
      type: "pie",
      data: {
        labels: ["Correct", "Mistakes", "Not Typed"],
        datasets: [
          {
            data: [corr, mist, left],
            backgroundColor: ["#4CAF50", "#FF5733", "#FFC107"],
          },
        ],
      },
    });
  }
}

function drawWPMChart(userWPM) {
  const ctx = document.getElementById("wpm-chart").getContext("2d");

  if (wpmCh) {
    wpmCh.options.plugins.annotation.annotations.userLine.value = userWPM; // Update the value
    wpmCh.update(); // Refresh chart
  } else {
    wpmCh = new Chart(ctx, {
      type: "line",
      data: globalWPM,
      options: {
        responsive: true,
        scales: {
          x: {
            title: { display: true, text: "Words Per Minute (WPM)" },
            type: "linear",
            min: 0,
            max: 160,
          },
          y: { title: { display: true, text: "% of Typists" } },
        },
        plugins: {
          annotation: {
            annotations: {
              userLine: {
                type: "line",
                mode: "vertical",
                scaleID: "x",
                value: userWPM,
                borderColor: "red",
                borderWidth: 2,
                label: {
                  content: `Your WPM: ${userWPM}`,
                  enabled: true,
                },
              },
            },
          },
        },
      },
    });
  }
}

function showStats(wpm, acc) {
  document.getElementById("wpm-rating").innerText = `${wpm} WPM`;
  document.getElementById("acc-rating").innerText = `${acc}%`;
}

function saveStats(currWPM, currCorrect, currMistakes, currLeft, currAcc) {
  let saveData = JSON.parse(localStorage.getItem("saveData")) || [];

  saveData.push({
    date: new Date().toJSON().slice(0, 10),
    wpm: currWPM,
    acc: currAcc,
    corr: currCorrect,
    mist: currMistakes,
    left: currLeft,
  });

  saveMetrics(saveData);
  localStorage.setItem("saveData", JSON.stringify(saveData));
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

  localStorage.setItem("metrics", JSON.stringify(metrics));
}

function checkImprovement(currentWPM, currentAccuracy) {
  const metrics = JSON.parse(localStorage.getItem("metrics"));
  const averageWPM = parseInt(metrics.aveWPM);
  const averageAcc = parseInt(metrics.aveAcc);

  if (averageWPM === null || averageAcc === null) {
    return "This is your first attempt!";
  }

  console.log(currentWPM);
  console.log(currentAccuracy);
  console.log(averageWPM);
  console.log(averageAcc);

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
