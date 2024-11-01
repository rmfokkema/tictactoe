import { GameState } from "../game-state";
import { Cell, Grid } from "./grid/grid";
import { getMarkLineWidth, Measurements, measurementsInclude } from "../measurements";
import { otherPlayer, Player } from "../player";
import { Possibility, PossibilityParent } from "./possibility";
import { O } from "./o";
import { X } from "./x";
import { Mark } from "./mark";
import { Point } from "../point";
import { Win } from "./win";
import { EquivalentPossibility } from "./equivalent-possibility";
import { ClickHandler, ClickHandlerNode, isAccepted } from "../events/types";
import { Theme } from "../themes";
import { Renderable, Renderer } from "../renderer/types";
import { GridCellMeasurements } from "./grid/types";

export interface TicTacToeParent {
    notifyWinner(): void
}

export interface RootTicTacToe extends ClickHandler, Renderable {
    tictactoe: TicTacToe
}

export class TicTacToe implements PossibilityParent, TicTacToeParent {
    private theme: Theme
    private win: Win | undefined;
    private readonly possibilities: Possibility[]
    private readonly marks: Mark[]
    private readonly equivalentPossibilities: EquivalentPossibility[] = [];
    private readonly ticTacToes: {position: number, tictactoe: TicTacToe}[] = []
    private grid: Grid | undefined;
    public winner: Player | undefined;
    public isWin: boolean;

    public constructor(
        private readonly parent: TicTacToeParent,
        private readonly clickHandler: ClickHandlerNode,
        private readonly renderer: Renderer,
        measurements: GridCellMeasurements,
        theme: Theme,
        private readonly gameState: GameState,
        private readonly gridCell: Cell | undefined
    ){
        if(gridCell){
            gridCell.visible = true;
        }
        const grid = this.grid = new Grid(measurements, theme)
        const possibilities: Possibility[] = this.possibilities = [];
        const marks: Mark[] = this.marks = [];
        const winner = gameState.findWinner();
        if(winner){
            this.winner = winner.player;
        }
        this.isWin = !!winner;
        this.theme = winner ? theme.winnerTheme : theme;
        let winnerStartPoint: Point | undefined;
        for(let position = 0; position < 9; position++){
            const cell = grid.cells[position]
            const measurements = cell.measurements;
            const playerAtCell = gameState.getPlayerAtPosition(position)
            if(playerAtCell === 0){
                if(winner){
                    continue;
                }
                const newGameState = gameState.playPosition(position)
                possibilities.push(new Possibility(clickHandler.child(), this, measurements, newGameState, position))
                continue;
            }
            const mark: Mark = playerAtCell === Player.X
                ? new X(measurements, theme)
                : new O(measurements, theme);
            
            marks.push(mark);
            
            if(winner && position === winner.three.positions[0]){
                winnerStartPoint = mark.getWinStart(winner.three);
            }
            if(winnerStartPoint && winner && position === winner.three.positions[2]){
                this.win = new Win(
                    theme,
                    winnerStartPoint,
                    mark.getWinEnd(winner.three),
                    getMarkLineWidth(grid.cellSize)
                )
            }
        }
        clickHandler.onClick((click) => {
            if(!isAccepted(click)){
                if(!measurementsInclude(measurements, click.x, click.y)){
                    click.reject();
                }
            }
        })
    }

    private replaceEquivalentPossibility(possibility: Possibility): void{
        const index = this.possibilities.indexOf(possibility);
        if(index === -1){
            return;
        }
        this.possibilities.splice(index, 1);
        possibility.destroy();
        const equivalentPossibility = new EquivalentPossibility(possibility.measurements);
        this.equivalentPossibilities.push(equivalentPossibility);
    }

    private setWinner(winner: Player): void{
        this.winner = winner;
        this.setTheme(this.theme);
        this.parent.notifyWinner();
    }

    public setTheme(theme: Theme): void{
        const isLosing = this.winner === this.gameState.currentPlayer;
        const isWinning = this.isWin || this.winner === otherPlayer(this.gameState.currentPlayer);
        const newTheme = isWinning ? theme.winnerTheme : isLosing ? theme.loserTheme : theme;
        this.theme = newTheme;
        this.win?.setTheme(newTheme);
        this.marks.forEach(m => m.setTheme(newTheme))
        this.gridCell?.setTheme(newTheme)
        this.grid?.setTheme(newTheme)
        this.ticTacToes.forEach(({tictactoe}) => tictactoe.setTheme(newTheme))
    }

    public notifyWinner(): void {
        const other = this.gameState.currentPlayer;
        const otherHasWon = this.ticTacToes.some(t => t.tictactoe.winner === other);
        if(otherHasWon){
            this.setWinner(other);
            return;
        }
        if(this.possibilities.length > 0){
            return;
        }
        const lastPlayer = otherPlayer(this.gameState.currentPlayer);
        if(this.ticTacToes.some(t => t.tictactoe.winner !== lastPlayer)){
            return;
        }
        this.setWinner(lastPlayer);
    }

    public draw(ctx: CanvasRenderingContext2D): void{
        this.grid?.drawCells(ctx)
        this.ticTacToes.forEach(t => t.tictactoe.draw(ctx))
        this.marks.forEach(m => m.draw(ctx))
        this.win?.draw(ctx)
        this.grid?.drawBorders(ctx);
    }

    public play(possibility: Possibility, gameState: GameState): void {
        const index = this.possibilities.indexOf(possibility);
        if(index === -1){
            return;
        }
        this.possibilities.splice(index, 1);
        possibility.destroy();
        
        const position = possibility.position;
        const tictactoe = new TicTacToe(
            this,
            this.clickHandler.child(),
            this.renderer,
            possibility.measurements,
            this.theme,
            gameState,
            this.grid?.cells[position]
        );
        this.ticTacToes.push({position, tictactoe});
        const equivalentStates = [...possibility.gameState.getEquivalentStates()];
        const equivalentPossibilities = this.possibilities.filter(p => equivalentStates.some(s => s.equals(p.gameState)))
        for(const equivalentPossibility of equivalentPossibilities){
            this.replaceEquivalentPossibility(equivalentPossibility)
        }
        if(tictactoe.winner){
            this.setWinner(tictactoe.winner)
        }
        this.renderer.rerender();
    }
}