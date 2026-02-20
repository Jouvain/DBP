import { type coord } from "./types";
import { type unitProfile } from "./types";
// import { type facing } from "./types";

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
let unit: unitProfile = {id: 1, coords:{x:5, y:5}, ggSpeed: 2, facing: "N"};
let ennemy: unitProfile = {id: 2, coords: {x:5, y:0}, ggSpeed: 2, facing: "S"};
let ennemy2: unitProfile = {id: 3, coords: {x:4, y:0}, ggSpeed: 2, facing: "W"};
let ennemy3: unitProfile = {id: 4, coords: {x:6, y:0}, ggSpeed: 2, facing: "E"};
let selectedUnitId: number | null = null;
let unitList: unitProfile[] = [unit, ennemy, ennemy2, ennemy3];
let ennemies: unitProfile[] = [ennemy, ennemy2, ennemy3];
let friends: unitProfile[]= [unit];

function render(): void {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawGrid();
  ennemies.forEach(unit => {
    drawUnit("red", unit);
  });

  friends.forEach(unit => {
    drawUnit("blue", unit);
  });


  if (selectedCell) {
    outlineCell(selectedCell);
  }

  if(selectedUnitId !== null) {
    const selectedUnit = unitList.find(unit => unit.id === selectedUnitId);
    if (selectedUnit) {
      drawSpeedRange(selectedUnit);
    }
  }
}

canvas.addEventListener("click", (event: MouseEvent) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  const x = Math.floor(mouseX / cellSize);
  const y = Math.floor(mouseY / cellSize);

  if (x >= 0 && x < gridSize && y >= 0 && y < gridSize) {
    const clickedCell: coord = { x, y };
    selectedCell = clickedCell;
    if(selectedUnitId !== null) {
      const selectedUnit = unitList.find(unit => unit.id === selectedUnitId);
      if (selectedUnit) {
        moveUnit(clickedCell, selectedUnit);
      }
      selectedUnitId = null;
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
    else {
      const clickedFriend = friends.find(
        friend => friend.coords?.x === clickedCell.x && friend.coords?.y === clickedCell.y
      );
      if (clickedFriend) {
        selectedUnitId = clickedFriend.id;
      }
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
  ctx.fillStyle = "white";
  switch(unit.facing) {
    case "N":
      ctx.fillRect(unit.coords!.x * cellSize + 5, unit.coords!.y * cellSize + 10, 30, 5);
      break;
    case "E":
      ctx.fillRect(unit.coords!.x * cellSize + 10, unit.coords!.y * cellSize + 5, 5, 30);
      break;
    case "S":
      ctx.fillRect(unit.coords!.x * cellSize + 5, unit.coords!.y * cellSize + 25, 30, 5);
      break;
    case "W":
      ctx.fillRect(unit.coords!.x * cellSize + 25, unit.coords!.y * cellSize + 5, 5, 30);
      break;
    default:
      console.log("Oups, no facing ??");
  }
}

// function changeFacing(unit: unitProfile, newFacing: string) {

// }

function outlineCell(selectedCell: coord) {
    ctx.strokeStyle = "#ff8c00";
    ctx.lineWidth = 3;
    ctx.strokeRect(selectedCell.x * cellSize + 1, selectedCell.y * cellSize + 1, cellSize - 2, cellSize - 2);
}

function drawSpeedRange(unit: unitProfile) {
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
      } else if (checkIsCellOccupied(unitList, selectedCell, selectedUnit.id)) {
        console.log("Cell already full !");
      } else {
        selectedUnit.coords!.x = selectedCell.x;
        selectedUnit.coords!.y = selectedCell.y;
        console.log("SelectedCell : ", selectedCell);
        console.log("SelectedUnit : ", selectedUnit);
      }
}

function checkIsCellOccupied(unitList: unitProfile[], cell:coord, ignoredUnitId: number | null = null): boolean {
  return unitList.some(
    unit => unit.id !== ignoredUnitId && unit.coords?.x === cell.x && unit.coords?.y === cell.y
  );
}
