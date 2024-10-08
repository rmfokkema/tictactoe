import { Cell } from "./cell";
import { Content } from "./content";
import { GameState } from "./game-state";
import { Grid } from "./grid";
import { Measurements } from "./measurements";
import { Player } from "./player";
import { Possibility } from "./possibility";
import { Tac } from "./tac";
import { Tic } from "./tic";
import { TicTacToeFactory } from "./tictactoe-factory";

export class TicTacToe implements Content {
    private readonly cells: Content[]
    private readonly grid: Grid;
    private readonly hasWinner: boolean;
    public constructor(
        measurements: Measurements,
        gameState: GameState
    ){
        const grid = this.grid = new Grid(measurements)
        const cellMeasurements = [...grid.getCellMeasurements()]
        const cells = this.cells = [];
        const winner = gameState.findWinner();
        if(winner){
            console.log('we have winner', winner)
        }
        this.hasWinner = !!winner;
        for(let position = 0; position < 9; position++){
            const measurements = cellMeasurements[position];
            const isLastPlayed = position === gameState.lastPlayedPosition;
            const playerAtCell = gameState.getPlayerAtPosition(position)
            const cellContent: Content | undefined = playerAtCell === 0 
                ? winner ? undefined : new Cell(measurements, new Possibility(measurements, gameState, position, TicTacToe.createContent))
                : playerAtCell === Player.Tic
                    ? new Tic(measurements, isLastPlayed)
                    : new Tac(measurements, isLastPlayed);
            
            if(cellContent){
                cells.push(cellContent)
            }
        }
    }

    public draw(ctx: CanvasRenderingContext2D): void{
        this.grid.draw(ctx)
        this.cells.forEach(c => c.draw(ctx))
    }

    public onChange(callback: () => void): void {
        this.cells.forEach(c => c.onChange(callback))
    }

    public handleClick(x: number, y: number): undefined{
        if(this.hasWinner){
            return;
        }
        const cell = this.cells.find(c => c.willHandleClick(x, y));
        if(!cell){
            return;
        }
        cell.handleClick(x, y)
    }

    public willHandleClick(x: number, y: number): boolean {
        if(this.hasWinner){
            return false;
        }
        return this.cells.some(c => c.willHandleClick(x, y))
    }

    public static createContent: TicTacToeFactory = (measurements, gameState) => new TicTacToe(measurements, gameState)
}