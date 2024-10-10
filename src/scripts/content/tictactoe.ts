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

export class TicTacToe extends ContentImpl implements PossibilityParent {
    private readonly win: Win | undefined;
    private readonly contents: Content[]
    private readonly grid: Grid;
    public constructor(
        parent: ContentParent,
        private readonly measurements: Measurements,
        gameState: GameState
    ){
        super(parent);
        const grid = this.grid = new Grid(this, measurements)
        const cellMeasurements = [...grid.getCellMeasurements()]
        const contents: Content[] = this.contents = [];
        const winner = gameState.findWinner();
        let winnerStartPoint: Point | undefined;
        for(let position = 0; position < 9; position++){
            const measurements = cellMeasurements[position];
            const isLastPlayed = position === gameState.lastPlayedPosition;
            const playerAtCell = gameState.getPlayerAtPosition(position)
            if(playerAtCell === 0){
                if(winner){
                    continue;
                }
                contents.push(new Possibility(this, measurements, gameState, position))
                continue;
            }
            const mark: Mark = playerAtCell === Player.X
                ? new X(this, measurements, isLastPlayed)
                : new O(this, measurements, isLastPlayed);
            
            contents.push(mark);
            
            if(winner && position === winner.three.positions[0]){
                winnerStartPoint = mark.getWinStart(winner.three);
            }
            if(winnerStartPoint && winner && position === winner.three.positions[2]){
                this.win = new Win(this, winnerStartPoint, mark.getWinEnd(winner.three), getMarkLineWidth(grid.cellSize))
            }
        }
    }

    public draw(ctx: CanvasRenderingContext2D): void{
        this.grid.draw(ctx)
        this.contents.forEach(c => c.draw(ctx))
        if(this.win){
            this.win.draw(ctx)
        }
    }

    public play(possibility: Possibility, gameState: GameState): void {
        const index = this.contents.indexOf(possibility);
        if(index === -1){
            return;
        }
        this.contents.splice(index, 1);
        const newContent = new TicTacToe(this, possibility.measurements, gameState);
        this.contents.push(newContent);
        this.triggerChange();
    }

    public handleClick(x: number, y: number): void{
        if(this.win){
            return;
        }
        const cell = this.contents.find(c => c.willHandleClick(x, y));
        if(!cell){
            return;
        }
        cell.handleClick(x, y)
    }

    public willHandleClick(x: number, y: number): boolean {
        if(!measurementsInclude(this.measurements, x, y)){
            return false;
        }
        if(this.win){
            return false;
        }
        return this.contents.some(c => c.willHandleClick(x, y))
    }
}