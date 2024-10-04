import { Measurements } from "./measurements";

interface Content{
    draw(): void
}

class Tic{
    public constructor(
        private readonly context: CanvasRenderingContext2D,
        private readonly measurements: Measurements
    ){
        
    }

    public draw(): void{
        const ctx = this.context;
        const {x, y, size} = this.measurements;
        ctx.lineWidth = size / 10;
        ctx.beginPath();
        ctx.moveTo(x + size / 4, y + size / 4);
        ctx.lineTo(x + 3 * size / 4, y + 3 * size / 4);
        ctx.moveTo(x + 3 * size / 4, y + size / 4);
        ctx.lineTo(x + size / 4, y + 3 * size / 4);
        ctx.stroke();
    }
}

class Tac{
    public constructor(
        private readonly context: CanvasRenderingContext2D,
        private readonly measurements: Measurements
    ){
        
    }

    public draw(): void{
        const ctx = this.context;
        const {x, y, size} = this.measurements;
        ctx.lineWidth = size / 10;
        ctx.beginPath();
        ctx.arc(x + size / 2, y + size / 2, size / 4, 0, 2 * Math.PI);
        ctx.stroke();
    }
}

class TicTacToeCell{
    public get empty(): boolean{return !this.content;}

    public constructor(
        public readonly measurements: Measurements,
        private content: Content | undefined
    ){

    }

    public setContent(content: Content): void{
        this.content = content;
    }

    public draw(){
        if(this.content){
            this.content.draw();
        }
    }
}

export class TicTacToe{
    private readonly lineWidth: number;
    private readonly bottom: number;
    private readonly right: number;
    private readonly vertical1: number;
    private readonly vertical2: number;
    private readonly horizontal1: number;
    private readonly horizontal2: number;
    private readonly cells: TicTacToeCell[]
    public constructor(
        private readonly context: CanvasRenderingContext2D,
        private readonly canvasEl: GlobalEventHandlers,
        private readonly measurements: Measurements,
        private readonly gameState: number,
        private readonly player: number
    ){
        const { size, x, y } = measurements;
        const lineWidth = this.lineWidth = size / 100;
        const cellSize = (size - 2 * lineWidth) / 3;
        const right = this.right = x + size;
        const vertical1 = this.vertical1 = x + cellSize + lineWidth / 2;
        const vertical2 = this.vertical2 = right - cellSize - lineWidth / 2;
        const bottom = this.bottom = y + size;
        const horizontal1 = this.horizontal1 = y + cellSize + lineWidth / 2;
        const horizontal2 = this.horizontal2 = bottom - cellSize - lineWidth / 2;
        const cells = this.cells = new Array(9);
        for(let rowIndex = 0; rowIndex < 3; rowIndex++){
            for(let columnIndex = 0; columnIndex < 3; columnIndex++){
                const cellX = columnIndex === 0 ? x : columnIndex === 1 ? vertical1 + lineWidth / 2 : vertical2 + lineWidth / 2;
                const cellY = rowIndex === 0 ? y : rowIndex === 1 ? horizontal1 + lineWidth / 2 : horizontal2 + lineWidth / 2;
                const cellMeasurements: Measurements = {x: cellX, y: cellY, size: cellSize};

                const cellIndex = 3 * rowIndex + columnIndex;
                const playerAtCell = (gameState >> (2 * cellIndex)) & 3;
                const cellContent: Content | undefined = playerAtCell === 0 ? undefined : playerAtCell === 1 ? new Tic(context, cellMeasurements) : new Tac(context, cellMeasurements);
                
                cells[cellIndex] = new TicTacToeCell(cellMeasurements, cellContent);
            }
        }
    }

    public draw(): void{
        const ctx = this.context;
        const {x, y} = this.measurements;
        ctx.lineWidth = this.lineWidth;
        ctx.beginPath();
        ctx.moveTo(this.vertical1, y);
        ctx.lineTo(this.vertical1, this.bottom);
        ctx.moveTo(this.vertical2, y);
        ctx.lineTo(this.vertical2, this.bottom);
        ctx.moveTo(x, this.horizontal1);
        ctx.lineTo(this.right, this.horizontal1);
        ctx.moveTo(x, this.horizontal2);
        ctx.lineTo(this.right, this.horizontal2);
        ctx.stroke();
        this.cells.forEach(c => c.draw())
    }

    private getColumnIndex(offsetX: number): number{
        if(offsetX < this.vertical1){
            return 0;
        }
        if(offsetX > this.vertical2){
            return 2;
        }
        return 1;
    }

    private getRowIndex(offsetY: number): number{
        if(offsetY < this.horizontal1){
            return 0;
        }
        if(offsetY > this.horizontal2){
            return 2;
        }
        return 1;
    }

    private chooseCell(rowIndex: number, columnIndex: number): void{
        const cellIndex = 3 * rowIndex + columnIndex;
        const cell = this.cells[cellIndex];
        if(!cell.empty){
            return;
        }
        const newMeasurements = this.cells[cellIndex].measurements;
        const newGameState = this.gameState | ((1 + this.player) << (2 * cellIndex))
        console.log('new game state', newGameState.toString(2))
        const newTicTacToe = new TicTacToe(this.context, this.canvasEl, newMeasurements, newGameState, (this.player + 1) % 2);
        newTicTacToe.draw();
        newTicTacToe.activate();
        cell.setContent(newTicTacToe);
    }

    public activate(): void{
        const {x, y} = this.measurements;
        const listener = ({offsetX, offsetY}: MouseEvent): void => {
            if(offsetX < x || offsetX > this.right || offsetY < y || offsetY > this.bottom){
                return;
            }
            this.chooseCell(this.getRowIndex(offsetY), this.getColumnIndex(offsetX))
        }
        this.canvasEl.addEventListener('click', listener);
    }
}