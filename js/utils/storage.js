export function getLocalStorageItem(key, defaultValue = null) {
  return JSON.parse(localStorage.getItem(key)) || defaultValue;
}

export function setLocalStorageItem(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
