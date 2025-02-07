let testText = "";
let time = 60;
let timerID;

export function getTextFromAPI() {
  fetch("http://metaphorpsum.com/paragraphs/1")
    .then((response) => response.text())
    .then((data) => {
      testText = data;
      addTextToHTML(data);
    })
    .catch((error) => console.error("Error fetching data:", error));
}

export function handleInput(input) {
  let correct, incorrect, text;
  if (testText.startsWith(input)) {
    correct = input;
    text = testText.slice(input.length);
    incorrect = "";
  } else {
    const similarityEndIndex = findSimilarityEnd(testText, input);
    correct = input.slice(0, similarityEndIndex);
    incorrect = testText.slice(similarityEndIndex, input.length);
    text = testText.slice(input.length);
  }
  highlightGreen(correct);
  highlightRed(incorrect);
  addTextToHTML(text);
  console.log(`Test: ${testText.length} Green: ${correct.length}`);
  if (correct.length === testText.length) {
    console.log("equal");
    stopTimer();
  }
}

export function startTimer() {
  if (!timerID) {
    timerID = setInterval(decreaseTimer, 1000);
  }
}

function findSimilarityEnd(str, substring) {
  let minLength = Math.min(str.length, substring.length);
  let i = 0;
  while (i < minLength && str[i] === substring[i]) {
    i++;
  }
  return i;
}

function addTextToHTML(text) {
  const para = document.getElementById("default-txt");
  para.innerText = text;
}

function highlightGreen(text) {
  const para = document.getElementById("correct-txt");
  para.innerText = text;
}
function highlightRed(text) {
  const para = document.getElementById("wrong-txt");
  para.innerText = text;
}

function decreaseTimer() {
  const timer = document.getElementById("timer");
  time--;
  timer.innerText = time;
  if (time === 0) {
    time = 60;
    stopTimer();
  }
}

function stopTimer() {
  console.log("stopping timer");
  clearInterval(timerID);
  timerID = null;
}
