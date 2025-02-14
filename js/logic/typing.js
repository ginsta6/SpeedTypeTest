import { calculateStats } from "./statistics.js";
import { updateText, highlightCorrect, highlightIncorrect, updateTimer } from "../utils/ui.js";

let testText = "";
let time = 60;
let timerID;
let longestCorrect = "";
let currentMistake = "";
let mistakeCount = 0;

export function getTextFromAPI() {
  return fetch("http://metaphorpsum.com/paragraphs/1")
    .then((response) => response.text())
    .then((data) => {
      testText = data;
      updateText(data);
    })
    .catch((error) => console.error("Error fetching data:", error));
}

export function dummyText() {
  testText = "my name is aldona";
  updateText("my name is aldona");
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
  updateText(text);
  displayCurrWord();
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

function highlightGreen(text) {
  highlightCorrect(text);
  logCorrect(text);
}

function highlightRed(text) {
  highlightIncorrect(text);
  logMistake(text);
}

function decreaseTimer() {
  time--;
  updateTimer(time);
  if (time === 0) {
    gameEnd();
    time = 60;
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
  time = 60;
  updateTimer(time);
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

function displayCurrWord() {
  const word = getCurrWord();
  const wordDisp = document.getElementById("curr-word");
  if (word !== null) {
    wordDisp.innerHTML = `<strong>Current word: <u>${word}</u></strong>`;
  } else {
    wordDisp.innerHTML = "";
  }
}
