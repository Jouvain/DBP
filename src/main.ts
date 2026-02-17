const canvasEl = document.getElementById("grid");
if (!(canvasEl instanceof HTMLCanvasElement)) {
  throw new Error("Canvas #grid introuvable.");
}

const maybeCtx = canvasEl.getContext("2d");
if (maybeCtx === null) {
  throw new Error("Impossible de recuperer le contexte 2D du canvas.");
}

const canvas = canvasEl;
const ctx: CanvasRenderingContext2D = maybeCtx;

const gridSize = 15;
const cellSize = 40;
canvas.width = gridSize * cellSize;
canvas.height = gridSize * cellSize;

let selectedCell: { x: number; y: number } | null = null;
let unit: {x: number, y: number} = {x:5,y:5};
let selectedUnit: boolean = false;

function drawGrid(): void {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#444";
  ctx.lineWidth = 1;
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
  }

  ctx.fillStyle = "red"
  ctx.fillRect(unit.x * cellSize + 5, unit.y * cellSize + 5, 30, 30)


  if (selectedCell) {
    const sx = selectedCell.x * cellSize;
    const sy = selectedCell.y * cellSize;
    ctx.strokeStyle = "#ff8c00";
    ctx.lineWidth = 3;
    ctx.strokeRect(sx + 1, sy + 1, cellSize - 2, cellSize - 2);
  }
}

canvas.addEventListener("click", (event: MouseEvent) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  const x = Math.floor(mouseX / cellSize);
  const y = Math.floor(mouseY / cellSize);

  if (x >= 0 && x < gridSize && y >= 0 && y < gridSize) {
    selectedCell = { x, y };
    if(selectedUnit) {
      selectedUnit = false;
      unit.x = selectedCell.x;
      unit.y = selectedCell.y;
    }
    else if(selectedCell.x == unit.x && selectedCell.y == unit.y) {
      selectedUnit = true;
      console.log("clic sur unité, selectedUnit :", selectedUnit);
    }
    drawGrid();
  }
});

drawGrid();


// ------------- UTILITAIREs -------------------------- //

