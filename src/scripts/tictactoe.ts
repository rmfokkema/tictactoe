import { Cell } from "./cell";
import { defaultColor, emphasisColor } from "./colors";
import { Content } from "./content";
import { GameState } from "./game-state";
import { Measurements } from "./measurements";
import { Player } from "./player";
import { Possibility } from "./possibility";
import { Tac } from "./tac";
import { Tic } from "./tic";
import { TicTacToeFactory } from "./tictactoe-factory";

let ticTacToeId = 0;
export class TicTacToe implements Content {
    private readonly id: number;
    private readonly lineWidth: number;
    private readonly bottom: number;
    private readonly right: number;
    private readonly vertical1: number;
    private readonly vertical2: number;
    private readonly horizontal1: number;
    private readonly horizontal2: number;
    private readonly cells: Cell[]
    public constructor(
        private readonly measurements: Measurements,
        gameState: GameState
    ){
        this.id = ticTacToeId++;
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

                const position = 3 * rowIndex + columnIndex;
                const isLastPlayed = position === gameState.lastPlayedPosition;
                const color = isLastPlayed ? emphasisColor : defaultColor;
                const playerAtCell = gameState.getPlayerAtPosition(position)
                const cellContent: Content = playerAtCell === 0 
                    ? new Possibility(cellMeasurements, gameState, position, TicTacToe.createContent)
                    : playerAtCell === Player.Tic
                        ? new Tic(cellMeasurements, color)
                        : new Tac(cellMeasurements, color);
                
                cells[position] = new Cell(cellMeasurements, cellContent);
            }
        }
    }

    public draw(ctx: CanvasRenderingContext2D): void{
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
        this.cells.forEach(c => c.draw(ctx))
    }

    public onChange(callback: () => void): void {
        this.cells.forEach(c => c.onChange(callback))
    }

    public handleClick(x: number, y: number): undefined{
        const cell = this.cells.find(c => c.willHandleClick(x, y));
        if(!cell){
            return;
        }
        console.log(`tictactoe #${this.id} handles click`)
        cell.handleClick(x, y)
    }

    public willHandleClick(x: number, y: number): boolean {
        return this.cells.some(c => c.willHandleClick(x, y))
    }

    public static createContent: TicTacToeFactory = (measurements, gameState) => new TicTacToe(measurements, gameState)
}