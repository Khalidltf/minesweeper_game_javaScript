let ROWS = 2;
let COLS = 2;
let SIZE = 24;
let canvas = document.getElementById("canvas");

let cells = new Map();
let revealedKeys = new Set();
let values = new Map([
  ["0-0", 1],
  ["0-1", 2],
  ["1-0", 3],
  ["1-1", null],
]);

function toKey(row, col) {
  return row + "-" + col;
}

function createButtons() {
  canvas.style.width = ROWS * SIZE + "px";
  canvas.style.height = COLS * SIZE + "px";
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      let cell = document.createElement("button");
      cell.style.float = "left";
      cell.style.width = SIZE + "px";
      cell.style.height = SIZE + "px";
      cell.onclick = () => {
        revealCell(key);
      };
      canvas.appendChild(cell);
      let key = toKey(i, j);
      cells.set(key, cell);
    }
  }
}

function updateButtons() {
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      let key = toKey(i, j);
      let cell = cells.get(key);
      if (revealedKeys.has(key)) {
        cell.disabled = true;
        let value = values.get(key);
        cell.style.backgroundColor = "";
        if (value === 0) {
          cell.textContent = "";
        } else if (value === 1) {
          cell.textContent = "1";
          cell.style.color = "blue";
        } else if (value === 2) {
          cell.textContent = "2";
          cell.style.color = "green";
        } else if (value === 3) {
          cell.textContent = "3";
          cell.style.color = "red";
        } else if (value === null) {
          cell.textContent = "💣";
        } else {
          throw Error("TODO");
        }
      } else {
        cell.disabled = false;
        cell.textContent = "";
      }
    }
  }
}

function revealCell(key) {
  revealedKeys.add(key);
  updateButtons();
}

createButtons();
