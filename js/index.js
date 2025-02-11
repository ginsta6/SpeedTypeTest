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

  input.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      restartTest();
    } else if (event.key === "Escape") {
      resetTest();
    }
  });

  document.getElementById("restart-btn").addEventListener("click", restartTest);
  document.getElementById("reset-btn").addEventListener("click", resetTest);
  document.getElementById("modal-restart-btn").addEventListener("click", restartTest);
  document.getElementById("modal-reset-btn").addEventListener("click", resetTest);
});