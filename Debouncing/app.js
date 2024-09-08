const input = document.querySelector("input");
const normal = document.querySelector("#normal span");
const debounced = document.querySelector("#debounce span");
const normalCounter = document.querySelector("#cnt span");
const debouncedCounter = document.querySelector("#dcnt span");

function normalUpdate(val) {
  normal.textContent = val;
  normalCounter.textContent++;
}

let changing = false,
  id;

function delayFn(val) {
  id = setTimeout(() => {
    debounced.textContent = val;
    debouncedCounter.textContent++;
    changing = false;
  }, 1000);
}

function debounceUpdate(val) {
  if (changing) {
    clearTimeout(id);
    delayFn(val);
    return;
  }
  changing = true;
  delayFn(val);
}

input.addEventListener("input", () => {
  normalUpdate(input.value);
  debounceUpdate(input.value);
});
