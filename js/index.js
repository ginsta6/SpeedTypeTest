import {
  getTextFromAPI,
  handleInput,
  startTimer,
  restartTest,
  resetTest,
  dummyText,
} from "./logic/typing.js";

document.addEventListener("DOMContentLoaded", () => {
  const tooltips = document.querySelectorAll(".my-tooltip");
  tooltips.forEach((t) => {
    new bootstrap.Tooltip(t, { html: true });
  });

  getTextFromAPI();
  const input = document.getElementById("user-input");
  input.addEventListener("input", (event) => {
    startTimer();
    handleInput(event.target.value);
  });
  document.addEventListener("keydown", handleGlobalKeys);
  document.getElementById("restart-btn").addEventListener("click", restartTest);
  document.getElementById("reset-btn").addEventListener("click", resetTest);
});

function handleGlobalKeys(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    restartTest();
  } else if (event.key === "Escape") {
    resetTest();
  } else if (event.altKey) {
    dummyText();
  }
}
