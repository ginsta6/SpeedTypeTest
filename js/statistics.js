let pieCh;
let wpmCh;

const globalWPM = {
  labels: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 120, 140, 160], // WPM bins
  datasets: [
    {
      label: "Typing Speed Distribution",
      data: [1, 5, 15, 30, 25, 15, 8, 5, 3, 2, 1, 0.5, 0.2], // Simulated % of people at each WPM range
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

export function calculateStats(testText, longestCorrect, mistakeCount, time) {
  console.log(longestCorrect.length);
  console.log(longestCorrect);
  if (testText.length !== 0 && longestCorrect.length !== 0) {
    const corr_words = toWordArr(longestCorrect);
    const total_words = toWordArr(testText);
    const overlap = findOverlap(corr_words, total_words);

    const overlapChars = overlap.join(" ").length;

    const wpm = calculateWPM(overlap.length, time);
    const acc = calculateAcc(overlapChars, mistakeCount);
    drawAccChart(overlapChars, mistakeCount, testText.length - longestCorrect.length);
    drawWPMChart(wpm);
    console.log(wpm);
    console.log(acc);
    showStats(wpm, acc);
    saveStats(wpm, acc);
  }
}

function toWordArr(text) {
  return text.match(/\b\w+(?:'\w+)?\b/g);
}

function findOverlap(user, total) {
  let overlap = [];
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
  return (wordsAmount * 60) / (60 - timeLeft);
}

function calculateAcc(correct, mistakeCount) {
  const acc = ((correct - mistakeCount) / correct) * 100;
  return acc;
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
            min: 10,
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
  document.getElementById("wpm-rating").innerText = `${Math.round(wpm)} WPM`;
  document.getElementById("acc-rating").innerText = `${Math.round(acc)}%`;
}

function saveStats(currWPM, currAcc) {
  let saveData = JSON.parse(localStorage.getItem("saveData")) || [];

  saveData.push({ date: new Date(), wpm: currWPM, acc: currAcc });

  localStorage.setItem("saveData", JSON.stringify(saveData));
}
