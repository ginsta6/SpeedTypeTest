import {
  getTextFromAPI,
  handleInput,
  startTimer,
  restartTest,
  resetTest,
  preventTyping,
} from "./typing.js";

document.addEventListener("DOMContentLoaded", () => {
  getTextFromAPI();
  handleModal();

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
});

//this is weird, one file stops input, another allows
function handleModal() {
  const finishModal = document.getElementById("finishModal");
  const inputField = document.getElementById("user-input");

  // Detect when the modal is hidden
  finishModal.addEventListener("hidden.bs.modal", () => {
    inputField.removeEventListener("keydown", preventTyping);
    inputField.classList.remove("no-select");
  });
}
