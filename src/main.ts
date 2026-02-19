import { type coord } from "./types";
import { type unitProfile } from "./types";

const canvasEl = document.getElementById("grid");
if (!(canvasEl instanceof HTMLCanvasElement)) {
  throw new Error("Canvas #grid introuvable.");
}

const btnPhase = document.getElementById("btn-phase");
btnPhase?.addEventListener("click", endPhase );

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



let selectedCell: coord | null = null;
let unit: unitProfile = {coords:{x:5, y:5}, ggSpeed: 2};
let ennemy: unitProfile = {coords: {x:5, y:0}, ggSpeed: 2};
// let selectedUnit: boolean = false;
let selectedUnit: unitProfile = {coords: null, ggSpeed: 0};
let isUnitSelected: boolean = false;
let unitList: unitProfile[] = [unit, ennemy];

function render(): void {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawGrid();

  drawUnit("blue", unit);
  drawUnit("red", ennemy);

  if (selectedCell) {
    outlineCell(selectedCell);
  }

  if(isUnitSelected) {
    drawSpeedRange();
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
    if(isUnitSelected) {

      moveUnit(selectedCell, selectedUnit);
      // let diffX:number = selectedCell.x - unit.coords.x;
      // let diffY:number = selectedCell.y - unit.coords.y;
      // if(diffX > unit.ggSpeed || diffY > unit.ggSpeed) {
      //   console.log("too far away !");
      // } else {
      //   selectedUnit = false;
      //   unit.coords.x = selectedCell.x;
      //   unit.coords.y = selectedCell.y;
      // }
    }
    else if(selectedCell.x == unit.coords?.x && selectedCell.y == unit.coords?.y) {
      selectedUnit = {coords: {x: unit.coords?.x, y: unit.coords?.y}, ggSpeed: unit.ggSpeed};
      isUnitSelected = true;
    }
    render();
  }
});

render();


// ------------- UTILITAIREs -------------------------- //

function drawGrid() {
  ctx.strokeStyle = "#444";
  ctx.lineWidth = 1;
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
  }
}

function drawUnit(color: string, unit: unitProfile) {
  ctx.fillStyle = color;
  ctx.fillRect(unit.coords!.x * cellSize + 5, unit.coords!.y * cellSize + 5, 30, 30);
}

function outlineCell(selectedCell: coord) {
    ctx.strokeStyle = "#ff8c00";
    ctx.lineWidth = 3;
    ctx.strokeRect(selectedCell.x * cellSize + 1, selectedCell.y * cellSize + 1, cellSize - 2, cellSize - 2);
}

function drawSpeedRange() {
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        if(x <= unit.coords!.x + unit.ggSpeed && x >= unit.coords!.x - unit.ggSpeed && y <= unit.coords!.y + unit.ggSpeed && y >= unit.coords!.y - unit.ggSpeed) {
          ctx.fillStyle = "green";
          ctx.fillRect(x* cellSize + 5, y * cellSize + 5, 30, 30);
        }
      }
    }
}

function endPhase() {
  console.log("fin de la phase");
}

function moveUnit(selectedCell: coord, selectedUnit: unitProfile) {
      let diffX:number = selectedCell.x - selectedUnit.coords!.x;
      let diffY:number = selectedCell.y - selectedUnit.coords!.y;
      if(diffX > selectedUnit.ggSpeed || diffY > selectedUnit.ggSpeed) {
        console.log("too far away !");
      } else if (checkIsCellOccupied(unitList, selectedCell)) {
        console.log("Cell already full !");
      } else {
        selectedUnit.coords!.x = selectedCell.x;
        selectedUnit.coords!.y = selectedCell.y;
        console.log("SelectedCell : ", selectedCell);
        console.log("SelectedUnit : ", selectedUnit);
        unit = selectedUnit;
      }
      isUnitSelected = false;
}

function checkIsCellOccupied(unitList: unitProfile[], cell:coord): boolean {
  return unitList.some(unit => unit.coords?.x === cell.x && unit.coords?.y === cell.y);
}