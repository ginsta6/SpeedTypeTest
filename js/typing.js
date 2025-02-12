import { calculateStats } from "./statistics.js";

let testText = "";
let time = 5;
let timerID;
let longestCorrect = "";
let currentMistake = "";
let mistakeCount = 0;

export function getTextFromAPI() {
  return fetch("http://metaphorpsum.com/paragraphs/1")
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
  underlineCurrWord();
  if (correct.length === testText.length) {
    gameEnd();
  }
}

export function startTimer() {
  if (!timerID) {
    resetCurrStats();
    timerID = setInterval(decreaseTimer, 1000);
  }
}

export function restartTest() {
  getTextFromAPI().then(() => {
    resetTest();
  });
}

export function resetTest() {
  const input = document.getElementById("user-input");
  input.value = "";
  input.focus();
  handleInput("");
  allowInput();
  resetTimer();
}

function resetCurrStats() {
  longestCorrect = "";
  currentMistake = "";
  mistakeCount = 0;
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
  logCorrect(text);
}

function highlightRed(text) {
  const para = document.getElementById("wrong-txt");
  para.innerText = text;
  logMistake(text);
}

function decreaseTimer() {
  const timer = document.getElementById("timer");
  time--;
  timer.innerText = time;
  if (time === 0) {
    gameEnd();
    time = 5;
  }
}

function gameEnd() {
  stopTimer();
  stopInput();
  calculateStats(testText, longestCorrect, mistakeCount, time);
}

function stopTimer() {
  clearInterval(timerID);
  timerID = null;
}

function resetTimer() {
  stopTimer();
  time = 5;
  document.getElementById("timer").innerText = time;
}

function logCorrect(text) {
  longestCorrect = text && text.length > longestCorrect.length ? text : longestCorrect;
}

function logMistake(text) {
  if (text.length > currentMistake.length) {
    mistakeCount++;
  }
  currentMistake = text;
}

function stopInput() {
  const inputField = document.getElementById("user-input");
  inputField.addEventListener("keydown", preventTyping);
  inputField.classList.add("no-select");
}

function allowInput() {
  const inputField = document.getElementById("user-input");
  inputField.removeEventListener("keydown", preventTyping);
  inputField.classList.remove("no-select");
}

function preventTyping(event) {
  event.preventDefault();
}

function getCurrWord() {
  const green = document.getElementById("correct-txt").innerText;
  let index = 0;
  if (green.length !== 0) {
    index = green.length - 1;
  }

  while (index > 0 && /[ ,.?!;:]/.test(testText[index])) {
    index++;
  }

  const regex = /\b\w+(?:'\w+)?\b/g;
  let match;

  while ((match = regex.exec(testText)) !== null) {
    let start = match.index;
    let end = start + match[0].length;

    if (index >= start && index < end) {
      return match[0]; // Return the full word
    }
  }

  return null; // No word found at the given index
}

function underlineCurrWord() {
  const word = getCurrWord();
  const wordDisp = document.getElementById("curr-word");
  if (word !== null) {
    wordDisp.innerHTML = `<strong>${word}</strong>`;
  } else {
    wordDisp.innerHTML = "";
  }
}