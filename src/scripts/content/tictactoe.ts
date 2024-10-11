import { Content, ContentParent } from "./content";
import { GameState } from "../game-state";
import { Grid } from "./grid";
import { getMarkLineWidth, Measurements, measurementsInclude } from "../measurements";
import { Player } from "../player";
import { Possibility, PossibilityParent } from "./possibility";
import { O } from "./o";
import { X } from "./x";
import { Mark } from "./mark";
import { Point } from "../point";
import { Win } from "./win";
import { ContentImpl } from "./content-impl";

export interface TicTacToeParent extends ContentParent{
    recordWinner(): void
    recordLoser(ticTacToe: TicTacToe): void
}

export class TicTacToe extends ContentImpl implements PossibilityParent, TicTacToeParent {
    private ticTacToeParent: TicTacToeParent | undefined
    private win: Win | undefined;
    private readonly possibilities: Possibility[]
    private readonly marks: Content[]
    private readonly ticTacToes: {position: number, ticTacToe: TicTacToe }[] = []
    private grid: Grid | undefined;
    public constructor(
        parent: TicTacToeParent,
        private readonly measurements: Measurements,
        private readonly gameState: GameState
    ){
        super(parent);
        this.ticTacToeParent = parent;
        const grid = this.grid = new Grid(this, measurements)
        const cellMeasurements = [...grid.getCellMeasurements()]
        const possibilities: Content[] = this.possibilities = [];
        const marks: Content[] = this.marks = [];
        const winner = gameState.findWinner();
        let winnerStartPoint: Point | undefined;
        for(let position = 0; position < 9; position++){
            const measurements = cellMeasurements[position];
            const playerAtCell = gameState.getPlayerAtPosition(position)
            if(playerAtCell === 0){
                if(winner){
                    continue;
                }
                possibilities.push(new Possibility(this, measurements, gameState, position, false))
                continue;
            }
            const mark: Mark = playerAtCell === Player.X
                ? new X(this, measurements)
                : new O(this, measurements);
            
            marks.push(mark);
            
            if(winner && position === winner.three.positions[0]){
                winnerStartPoint = mark.getWinStart(winner.three);
            }
            if(winnerStartPoint && winner && position === winner.three.positions[2]){
                this.win = new Win(this, winnerStartPoint, mark.getWinEnd(winner.three), getMarkLineWidth(grid.cellSize))
            }
        }
    }

    private hasOnlyLosingPossibilities(): boolean{
        return this.ticTacToes.length === 0 && this.possibilities.length > 0 && this.possibilities.every(p => p.isLosing);
    }

    public draw(ctx: CanvasRenderingContext2D): void{
        this.possibilities.forEach(c => c.draw(ctx))
        this.ticTacToes.forEach(t => t.ticTacToe.draw(ctx))
        this.marks.forEach(m => m.draw(ctx))
        this.win?.draw(ctx)
        this.grid?.draw(ctx)
    }

    public recordWinner(): void {
        this.ticTacToeParent?.recordLoser(this)
    }

    public recordLoser(ticTacToe: TicTacToe): void {
        const index = this.ticTacToes.findIndex(t => t.ticTacToe === ticTacToe);
        if(index === -1){
            return;
        }
        const [{position}] = this.ticTacToes.splice(index, 1);
        this.removeChild(ticTacToe);
        const grid = this.grid;
        if(!grid){
            return;
        }
        const measurements = [...grid.getCellMeasurements()][position]
        const possibility = new Possibility(this, measurements, this.gameState, position, true);
        this.possibilities.push(possibility);
        this.triggerChange();
    }

    public play(possibility: Possibility, gameState: GameState): void {
        const index = this.possibilities.indexOf(possibility);
        if(index === -1){
            return;
        }
        this.possibilities.splice(index, 1);
        this.removeChild(possibility)
        
        this.ticTacToes.push({
            ticTacToe: new TicTacToe(this, possibility.measurements, gameState),
            position: possibility.position
        });
        this.triggerChange();
    }

    public handleClick(x: number, y: number): void{
        if(this.win){
            this.ticTacToeParent?.recordWinner()
            return;
        }
        const possibility = this.possibilities.find(c => c.willHandleClick(x, y));
        if(possibility){
            possibility.handleClick();
            return;
        }
        const ticTacToe = this.ticTacToes.find(t => t.ticTacToe.willHandleClick(x, y))
        if(ticTacToe){
            ticTacToe.ticTacToe.handleClick(x, y);
            return;
        }
        if(this.hasOnlyLosingPossibilities()){
            this.ticTacToeParent?.recordWinner()
        }
    }

    public willHandleClick(x: number, y: number): boolean {
        if(!measurementsInclude(this.measurements, x, y)){
            return false;
        }
        if(this.win || this.hasOnlyLosingPossibilities()){
            return true;
        }
        return this.possibilities.some(c => c.willHandleClick(x, y)) || this.ticTacToes.some(t => t.ticTacToe.willHandleClick(x, y))
    }

    public destroy(): void {
        super.destroy();
        this.win = undefined;
        this.grid = undefined;
        this.ticTacToeParent = undefined;
    }
}