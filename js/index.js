import { getTextFromAPI, handleInput, startTimer } from "./typing.js";

document.addEventListener("DOMContentLoaded", () => {
  getTextFromAPI();

  document.getElementById("user-input").addEventListener("input", (event) => {
    startTimer();
    handleInput(event.target.value);
  });
});
