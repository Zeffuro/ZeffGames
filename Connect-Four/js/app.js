import { Canvas } from "../../modules/common.js";
import { SoundPlayer } from "../../modules/sound.js";

let gameCanvas;
let soundPlayer;

const gameSettings = {
    width: 600,
    height: 600,
    bgColor: "darkblue",
    fgColor: "white",
    playerOneColor: "red",
    playerTwoColor: "yellow",
    grid: {
        enabled: true,
        rows: 6,
        cols: 7,
    },
    gameEnded: false,
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
    if(e.target.id != "canvas" || gameSettings.gameEnded) return;
    let { x, _ } = gameCanvas.getGridCoordsFromPosition(e.offsetX, e.offsetY, gameSettings);
    processPlayerTurn(x);
});

function processPlayerTurn(gridX){
    for(let i = 5; i >= 0; i--){
        if(gameState.gridState[i][gridX] == null){
            gameState.gridState[i][gridX] = gameState.activePlayer;
            drawPlayer(gridX, i);            
            break;
        }
    }

    if (checkWin(gameState.activePlayer, gameState.gridState)) {
        soundPlayer.playTune.ff();
        gameSettings.gameEnded = true;
        //alert(`Player ${gameState.activePlayer + 1} wins!`);
        return;
    }

    gameState.activePlayer = gameState.activePlayer === 0 ? 1 : 0;
}

function checkWin(player, grid) {
    const rows = grid.length;
    const cols = grid[0].length;
    const inARowToWin = 4;

    // Check horizontal
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col <= cols - inARowToWin; col++) {
            if (grid[row].slice(col, col + inARowToWin).every(cell => cell === player)) {
                return true;
            }
        }
    }

    // Check vertical
    for (let col = 0; col < cols; col++) {
        for (let row = 0; row <= rows - inARowToWin; row++) {
            if ([...Array(inARowToWin).keys()].every(i => grid[row + i][col] === player)) {
                return true;
            }
        }
    }

    // Check diagonal (top-left to bottom-right)
    for (let row = 0; row <= rows - inARowToWin; row++) {
        for (let col = 0; col <= cols - inARowToWin; col++) {
            if ([...Array(inARowToWin).keys()].every(i => grid[row + i][col + i] === player)) {
                return true;
            }
        }
    }

    // Check diagonal (bottom-left to top-right)
    for (let row = inARowToWin - 1; row < rows; row++) {
        for (let col = 0; col <= cols - inARowToWin; col++) {
            if ([...Array(inARowToWin).keys()].every(i => grid[row - i][col + i] === player)) {
                return true;
            }
        }
    }

    return false;
}


function drawPlayer(playerX, playerY){
    let { x, y } = gameCanvas.getGridVector(playerX, playerY, gameSettings);
    if(gameState.activePlayer == 0){
        gameCanvas.drawFilledCircle(x, y, 40, gameSettings.fgColor, gameSettings.playerOneColor);
    }else{
        gameCanvas.drawFilledCircle(x, y, 40, gameSettings.fgColor, gameSettings.playerTwoColor);
    }
}