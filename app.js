


let ROWS = 9;
let COLS = 9;
let SIZE = 24;
let canvas = document.getElementById("canvas");

function createButtons() {
  canvas.style.width = ROWS * SIZE;
  canvas.style.height = COLS * SIZE;
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      let btn = document.createElement("button");
      btn.style.width = SIZE;
      btn.style.height = SIZE;
      canvas.appendChild(btn);
    }
  }
}

createButtons();
