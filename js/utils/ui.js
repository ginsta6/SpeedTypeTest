export function updateText(text) {
  document.getElementById("default-txt").innerText = text;
}

export function highlightCorrect(text) {
  document.getElementById("correct-txt").innerText = text;
}

export function highlightIncorrect(text) {
  document.getElementById("wrong-txt").innerText = text;
}

export function updateTimer(time) {
  document.getElementById("timer").innerText = time;
}
