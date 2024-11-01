import { Content, ContentParent } from "./content";
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
import { ContentImpl } from "./content-impl";
import { EquivalentPossibility } from "./equivalent-possibility";
import { ClickEventAtTarget, isAccepted } from "../events/types";
import { Theme } from "../themes";

export interface TicTacToeParent extends ContentParent{
    notifyWinner(): void
}

export class TicTacToe extends ContentImpl implements PossibilityParent, TicTacToeParent {
    declare parent: TicTacToeParent
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
        parent: TicTacToeParent,
        private readonly measurements: Measurements,
        theme: Theme,
        private readonly gameState: GameState,
        private readonly gridCell: Cell | undefined
    ){
        super(parent);
        if(gridCell){
            gridCell.visible = true;
        }
        const grid = this.grid = new Grid(this, measurements, theme)
        const possibilities: Content[] = this.possibilities = [];
        const marks: Content[] = this.marks = [];
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
                possibilities.push(new Possibility(this, measurements, newGameState, position))
                continue;
            }
            const mark: Mark = playerAtCell === Player.X
                ? new X(this, measurements, theme)
                : new O(this, measurements, theme);
            
            marks.push(mark);
            
            if(winner && position === winner.three.positions[0]){
                winnerStartPoint = mark.getWinStart(winner.three);
            }
            if(winnerStartPoint && winner && position === winner.three.positions[2]){
                this.win = new Win(
                    this,
                    theme,
                    winnerStartPoint,
                    mark.getWinEnd(winner.three),
                    getMarkLineWidth(grid.cellSize)
                )
            }
        }
    }

    protected handleClickOnSelf(click: ClickEventAtTarget): void {
        if(!isAccepted(click)){
            if(!measurementsInclude(this.measurements, click.x, click.y)){
                click.reject();
            }
        }
    }

    private replaceEquivalentPossibility(possibility: Possibility): void{
        const index = this.possibilities.indexOf(possibility);
        if(index === -1){
            return;
        }
        this.possibilities.splice(index, 1);
        this.removeChild(possibility);
        const equivalentPossibility = new EquivalentPossibility(this, possibility.measurements);
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
        this.grid?.draw(ctx)
        this.possibilities.forEach(c => c.draw(ctx))
        this.equivalentPossibilities.forEach(p => p.draw(ctx))
        this.ticTacToes.forEach(t => t.tictactoe.draw(ctx))
        this.marks.forEach(m => m.draw(ctx))
        this.win?.draw(ctx)
    }

    public play(possibility: Possibility, gameState: GameState): void {
        const index = this.possibilities.indexOf(possibility);
        if(index === -1){
            return;
        }
        this.possibilities.splice(index, 1);
        this.removeChild(possibility)
        
        const position = possibility.position;
        const tictactoe = new TicTacToe(this, possibility.measurements, this.theme, gameState, this.grid?.cells[position]);
        this.ticTacToes.push({position, tictactoe});
        const equivalentStates = [...possibility.gameState.getEquivalentStates()];
        const equivalentPossibilities = this.possibilities.filter(p => equivalentStates.some(s => s.equals(p.gameState)))
        for(const equivalentPossibility of equivalentPossibilities){
            this.replaceEquivalentPossibility(equivalentPossibility)
        }
        if(tictactoe.winner){
            this.setWinner(tictactoe.winner)
        }
        this.triggerChange();
    }

    public destroy(): void {
        super.destroy();
        this.win = undefined;
        this.grid = undefined;
        this.possibilities.splice(0)
        this.ticTacToes.splice(0)
        this.possibilities.splice(0)
        this.equivalentPossibilities.splice(0)
    }
}