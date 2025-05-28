function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

class Canvas {
    constructor(){
        /** @type {CanvasRenderingContext2D} */ this.ctx = null;
    }
    setupGame(gameSettings){
        canvas = document.getElementById("canvas");
        this.ctx = canvas.getContext("2d");
        this.ctx.scale(1,1);

        let cellSize = gameSettings.width / gameSettings.grid.cols;
        gameSettings.height = cellSize * gameSettings.grid.rows;

        canvas.setAttribute("width", gameSettings.width);
        canvas.setAttribute("height", gameSettings.height);

        if(gameSettings.grid.enabled) this.setupGrid(gameSettings);
    }

    setupGrid(gameSettings){
        let grid = gameSettings.grid;
        for(let row = 1; row <= grid.rows; row++){
            let y = ((gameSettings.height / grid.rows) * row);
            this.drawSharpLine(0, y, gameSettings.width, y, gameSettings.fgColor);
        }

        for(let col = 1; col <= grid.cols; col++){
            let x = ((gameSettings.width / grid.cols) * col);
            this.drawSharpLine(x, 0, x, gameSettings.height, gameSettings.fgColor);
        }
    }

    drawSharpLine(x1, y1, x2, y2, color) {
        this.ctx.strokeStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(x1 + 0.5, y1 + 0.5);
        this.ctx.lineTo(x2 + 0.5, y2 + 0.5);
        this.ctx.stroke();
    }

    drawCircle(x, y, r, borderColor){
        this.ctx.strokeStyle = borderColor;
        this.ctx.lineWidth = 1.5;

        this.ctx.beginPath();
        this.ctx.arc(x + 0.5, y + 0.5, r - 0.5, 0, Math.PI * 2);
        this.ctx.stroke();
    }

    drawFilledCircle(x, y, r, borderColor, fillColor){
        this.ctx.strokeStyle = borderColor;
        this.ctx.fillStyle = fillColor;
        this.ctx.lineWidth = 1.5;

        this.ctx.beginPath();
        this.ctx.arc(x + 0.5, y + 0.5, r - 0.5, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
    }

    drawCross(x, y, s, color){
        this.drawSharpLine(x - s, y - s, x + s, y + s, color);
        this.drawSharpLine(x + s, y - s, x - s, y + s, color);
    }

    getGridVector(gridX, gridY, gameSettings) {
        let cellWidth = gameSettings.width / gameSettings.grid.cols;
        let cellHeight = gameSettings.height / gameSettings.grid.rows;
        
        return {
            x: (gridX + 0.5) * cellWidth,
            y: (gridY + 0.5) * cellHeight
        };
    }

    getGridCoordsFromPosition(x, y, gameSettings) {
        let cellWidth = gameSettings.width / gameSettings.grid.cols;
        let cellHeight = gameSettings.height / gameSettings.grid.rows;

        return {
            x: Math.floor(x / cellWidth),
            y: Math.floor(y / cellHeight)
        };
    }
}

export { Canvas }