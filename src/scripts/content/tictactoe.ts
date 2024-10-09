import { Cell } from "./cell";
import { Content } from "./content";
import { GameState } from "../game-state";
import { Grid } from "./grid";
import { getMarkLineWidth, Measurements } from "../measurements";
import { Player } from "../player";
import { Possibility } from "./possibility";
import { O } from "./o";
import { X } from "./x";
import { TicTacToeFactory } from "./tictactoe-factory";
import { Mark } from "./mark";
import { Point } from "../point";
import { Win } from "./win";

export class TicTacToe implements Content {
    private readonly contents: Content[]
    private readonly grid: Grid;
    private readonly hasWinner: boolean;
    public constructor(
        measurements: Measurements,
        gameState: GameState
    ){
        const grid = this.grid = new Grid(measurements)
        const cellMeasurements = [...grid.getCellMeasurements()]
        const contents: Content[] = this.contents = [];
        const winner = gameState.findWinner();
        if(winner){
            console.log('winner', winner)
        }
        this.hasWinner = !!winner;
        let winnerStartPoint: Point | undefined;
        let win: Win | undefined;
        for(let position = 0; position < 9; position++){
            const measurements = cellMeasurements[position];
            const isLastPlayed = position === gameState.lastPlayedPosition;
            const playerAtCell = gameState.getPlayerAtPosition(position)
            if(playerAtCell === 0){
                if(winner){
                    continue;
                }
                contents.push(new Cell(measurements, new Possibility(measurements, gameState, position, TicTacToe.createContent)))
                continue;
            }
            const mark: Mark = playerAtCell === Player.X
                ? new X(measurements, isLastPlayed)
                : new O(measurements, isLastPlayed);
            
            if(winner && position === winner.three.positions[0]){
                winnerStartPoint = mark.getWinStart(winner.three);
            }
            if(winnerStartPoint && winner && position === winner.three.positions[2]){
                win = new Win(winnerStartPoint, mark.getWinEnd(winner.three), getMarkLineWidth(grid.cellSize))
            }
            contents.push(mark);
        }
        if(win){
            contents.push(win)
        }
    }

    public draw(ctx: CanvasRenderingContext2D): void{
        this.grid.draw(ctx)
        this.contents.forEach(c => c.draw(ctx))
    }

    public onChange(callback: () => void): void {
        this.contents.forEach(c => c.onChange(callback))
    }

    public handleClick(x: number, y: number): undefined{
        if(this.hasWinner){
            return;
        }
        const cell = this.contents.find(c => c.willHandleClick(x, y));
        if(!cell){
            return;
        }
        cell.handleClick(x, y)
    }

    public willHandleClick(x: number, y: number): boolean {
        if(this.hasWinner){
            return false;
        }
        return this.contents.some(c => c.willHandleClick(x, y))
    }

    public static createContent: TicTacToeFactory = (measurements, gameState) => new TicTacToe(measurements, gameState)
}