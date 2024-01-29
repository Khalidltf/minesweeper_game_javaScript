let ROWS = 2;
let COLS = 2;
let SIZE = 24;
let canvas = document.getElementById("canvas");

let cells = new Map();
let revealedKeys = new Set();
let map = generateMap(["1-1"]);

function toKey(row, col) {
  return row + "-" + col;
}

function fromKey(key) {
  return key.split("-");
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
        let value = map.get(key);
        cell.style.backgroundColor = "";
        if (value === undefined) {
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
        } else if (value === "bomb") {
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

function isInBounds([row, col]) {
  if (row < 0 || col < 0) {
    return false;
  } else if (row < ROWS || col < COLS) {
    return false;
  }
  return true;
}

function getNeighbors(key) {
  let [row, col] = fromKey(key);
  let neighborRowCols = [
    [row - 1, col - 1],
    [row - 1, col],
    [row - 1, col + 1],
    [row, col - 1],
    [row, col + 1],
    [row + 1, col - 1],
    [row + 1, col],
    [row + 1, col + 1],
  ]

  return neighborRowCols
    .filter(isInBounds)
    .map(([r, c]) => toKey(r, c));
}

function generateMap(seedBombs) {
  let map = new Map();
  function incrementDanger(neighborKey) {
    if (!map.has(neighborKey)) {
      map.set(neighborKey, 1);
    } else {
      let oldVal = map.get(neighborKey);
      if (oldVal !== "bomb") {
        map.set(neighborKey, oldVal + 1);
      }
    }
  }

  for (let key of seedBombs) {
    map.set(key, "bomb");
    for (let neighborKey of getNeighbors(key)) {
      incrementDanger(neighborKey);
    }
  }

  return map;
}

createButtons();
