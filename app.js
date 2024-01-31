let ROWS = 9;
let COLS = 9;
let SIZE = 24;
let canvas = document.getElementById("canvas");

let cells = new Map();
let revealedKeys = new Set();
let flaggedKeys = new Set();
let map = generateMap(generateBombs());

function toKey(row, col) {
  return row + "-" + col;
}

function fromKey(key) {
  return key.split("-").map(Number);
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
      cell.oncontextmenu = (e) => {
        e.preventDefault();
        toggleFlag(key);
        updateButtons();
      };
      cell.onclick = () => {
        if (!flaggedKeys.has(key)) {
          propagateReveal(key, new Set());
          updateButtons();
        }
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

      cell.style.backgroundColor = "";
      cell.style.color = "";
      cell.textContent = "";
      cell.disabled = false;

      if (revealedKeys.has(key)) {
        cell.disabled = true;
        let value = map.get(key);
        if (value === undefined) {
          cell.textContent = "";
        } else if (value === 1) {
          cell.textContent = "1";
          cell.style.color = "blue";
        } else if (value === 2) {
          cell.textContent = "2";
          cell.style.color = "green";
        } else if (value >= 3) {
          cell.textContent = value;
          cell.style.color = "red";
        } else if (value === "bomb") {
          cell.textContent = "💣";
        } else {
          throw Error("should never happen");
        }
      } else if (flaggedKeys.has(key)) {
        cell.textContent = "🚩";
      }
    }
  }
}

function toggleFlag(key) {
  if (flaggedKeys.has(key)) {
    flaggedKeys.delete(key);
  } else {
    flaggedKeys.add(key);
  }
}

function propagateReveal(key, visited) {
  revealedKeys.add(key);
  visited.add(key);
  let isEmpty = !map.has(key);
  if (isEmpty) {
    for (let neighborKey of getNeighbors(key)) {
      if (!visited.has(neighborKey)) {
        propagateReveal(neighborKey, visited);
      }
    }
  }
}

function isInBounds([row, col]) {
  if (row < 0 || col < 0) {
    return false;
  }
  if (row >= ROWS || col >= COLS) {
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
  ];

  return neighborRowCols.filter(isInBounds).map(([r, c]) => toKey(r, c));
}

function generateBombs() {
  let count = Math.round(Math.sqrt(COLS * ROWS));
  let bombs = []; // !missed

  let allKeys = [];
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      allKeys.push(toKey(i, j));
    }
  }

  allKeys.sort(() => {
    let coinFlip = Math.random() > 0.5;
    return coinFlip ? 1 : -1;
  });
  return allKeys.slice(0, count);
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
