let pieCh;

export function calculateStats(testText, longestCorrect, mistakeCount, time) {
  if (testText.length !== 0 && longestCorrect.length !== 0) {
    const corr_words = toWordArr(longestCorrect);
    const total_words = toWordArr(testText);
    const overlap = findOverlap(corr_words, total_words);

    const overlapChars = overlap.join(" ").length;

    const wpm = calculateWPM(overlap.length, time);
    const acc = calculateAcc(overlapChars, mistakeCount);
    drawPieCh(overlapChars, mistakeCount, testText.length - longestCorrect.length);
    console.log(wpm);
    console.log(acc);
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

function drawPieCh(corr, mist, left) {
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

function saveStats(currWPM, currAcc) {
  let saveData = JSON.parse(localStorage.getItem("saveData")) || [];

  saveData.push({ date: new Date(), wpm: currWPM, acc: currAcc });

  localStorage.setItem("saveData", JSON.stringify(saveData));
}
