import { Canvas } from "../../modules/common.js";
import { SoundPlayer } from "../../modules/sound.js";

let gameCanvas;
let soundPlayer;

const gameSettings = {
    width: 600,
    height: 600,
    bgColor: "black",
    fgColor: "white",
    grid: {
        enabled: true,
        rows: 3,
        cols: 3,
    }
}

const emptyGrid = (rows, cols) => Array.from({ length: rows }, () => Array(cols).fill(null));

let gameState = {
    activePlayer: 0,
    gridState: emptyGrid(gameSettings.grid.rows, gameSettings.grid.cols)
}

document.addEventListener("DOMContentLoaded", function() {
    gameCanvas = new Canvas();
    gameCanvas.setupGame(gameSettings);

    soundPlayer = new SoundPlayer();
    soundPlayer.setVolume(0.2);
    soundPlayer.setType("square");
});

document.addEventListener("click", function(e) {
    if(e.target.id != "canvas") return;
    let { x, y } = gameCanvas.getGridCoordsFromPosition(e.offsetX, e.offsetY, gameSettings);
    processPlayerTurn(x, y);
});

function processPlayerTurn(gridX, gridY){
    if (gameState.gridState[gridY][gridX] !== null) return;

    gameState.gridState[gridY][gridX] = gameState.activePlayer;
    drawPlayer(gridX, gridY);

    if (checkWin(gameState.activePlayer, gameState.gridState)) {
        soundPlayer.playTune.ff();
        //alert(`Player ${gameState.activePlayer + 1} wins!`);
        return;
    }

    gameState.activePlayer = gameState.activePlayer === 0 ? 1 : 0;
}

function checkWin(player, grid) {
    const size = grid.length;

    // Horizontal / Vertical
    for (let i = 0; i < size; i++) {
        if (grid[i].every(cell => cell === player)) return true;
        if (grid.every(row => row[i] === player)) return true;
    }

    // Diagonals
    if (grid.every((row, i) => row[i] === player)) return true;
    if (grid.every((row, i) => row[size - 1 - i] === player)) return true;

    return false;
}


function drawPlayer(playerX, playerY){
    let { x, y } = gameCanvas.getGridVector(playerX, playerY, gameSettings);
    if(gameState.activePlayer == 0){
        gameCanvas.drawCross(x, y, 80, gameSettings.fgColor)
    }else{
        gameCanvas.drawCircle(x, y, 80, gameSettings.fgColor);
    }
}