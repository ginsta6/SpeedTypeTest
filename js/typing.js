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
  testText = "my name is aldona";
  addTextToHTML("my name is aldona");
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
  if (correct.length === testText.length) {
    stopTimer();
  }
}

export function startTimer() {
  if (!timerID) {
    timerID = setInterval(decreaseTimer, 1000);
  }
}

export function restartTest() {
  getTextFromAPI();
  resetTest();
}

export function resetTest() {
  document.getElementById("user-input").value = "";
  handleInput("");
  resetTimer();
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
    showModal();
  }
}

function stopTimer() {
  clearInterval(timerID);
  timerID = null;
}

function resetTimer() {
  stopTimer();
  time = 60;
  document.getElementById("timer").innerText = time;
}

function showModal() {
  const modal = new bootstrap.Modal(document.getElementById("finishModal"));
  modal.show();
}
