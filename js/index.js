import {
  getTextFromAPI,
  handleInput,
  startTimer,
  restartTest,
  resetTest,
} from "./typing.js";

document.addEventListener("DOMContentLoaded", () => {
  getTextFromAPI();

  const input = document.getElementById("user-input");

  input.addEventListener("input", (event) => {
    startTimer();
    handleInput(event.target.value);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      restartTest();
    } else if (event.key === "Escape") {
      resetTest();
    }
  });

  document.getElementById("restart-btn").addEventListener("click", restartTest);
  document.getElementById("reset-btn").addEventListener("click", resetTest);
});