import { otherPlayer, Player } from "@shared/player";
import type { GameState } from "@shared/state/game-state";
import type { GameStateTree } from "@shared/state/game-state-tree";
import type { Grid, GridCell, Theme } from "../ui";
import { Possibility, type PossibilityParent } from "./possibility";
import type { TicTacToeParent } from "./tictactoe-parent";
import { X } from "./x";
import type { MarkParent } from "./mark-parent";
import type { Destroyable } from "./destroyable";
import { O } from "./o";

function calculateAdjustedTheme<TTheme extends Theme>(tree: GameStateTree, theme: TTheme): TTheme {
    const currentPlayer = tree.state.getCurrentPlayer();
    const isLosing = tree.winner === currentPlayer;
    const isWinning = tree.winner === otherPlayer(currentPlayer);
    return isWinning ? theme.winnerTheme : isLosing ? theme.loserTheme : theme;
}

export class TicTacToeImpl<TTheme extends Theme> {
    private readonly isWinner: boolean;
    private readonly playersAtPositions: (0 | Player)[];
    private theme: TTheme
    private readonly possibilityParent: PossibilityParent;
    private readonly possibilities: Possibility[]
    private readonly marks: Destroyable[];
    private readonly ticTacToes: TicTacToeImpl<TTheme>[];
    public readonly state: GameState;
    public constructor(
        private readonly parent: TicTacToeParent,
        private tree: GameStateTree,
        private readonly grid: Grid<TTheme>,
        private readonly gridCell: GridCell<TTheme> | undefined,
        theme: TTheme,
    ){
        this.possibilityParent = {
            play(possibility) {
                parent.notifyRevealedState(possibility.gameState);
                parent.notifySelectedState(possibility.gameState)
            },
        };
        const markParent: MarkParent = {
            notifyMarkDoubleClicked(): void {
                parent.notifyHiddenState(tree.state);
            },
            notifyMarkClicked(){
                parent.notifySelectedState(tree.state)
            }
        };
        this.state = tree.state;
        const adjustedTheme = calculateAdjustedTheme(tree, theme);
        this.theme = adjustedTheme;
        grid.setTheme(adjustedTheme);
        const possibilities: Possibility[] = this.possibilities = [];
        const marks: Destroyable[] = this.marks = [];
        const ticTacToes: TicTacToeImpl<TTheme>[] = this.ticTacToes = [];
        const playersAtPositions = this.playersAtPositions = [...tree.state.getPlayersAtPositions()];
        const winner = tree.winnerInState;
        this.isWinner = !!winner;
        for(let position = 0; position < 9; position++){
            const cell = grid.cells[position];
            const playerAtCell = playersAtPositions[position];
            if(playerAtCell === 0){
                if(winner){
                    continue;
                }
                const stateForCell = tree.state.playPosition(position);
                const treeForCell = tree.getForState(stateForCell);
                if(treeForCell){
                    ticTacToes.push(new TicTacToeImpl(
                        parent,
                        treeForCell,
                        cell.displayGrid(),
                        cell,
                        adjustedTheme
                    ))
                }else{
                    possibilities.push(new Possibility(
                        cell,
                        this.possibilityParent,
                        stateForCell
                    ));
                }
                continue;
            }
            if(playerAtCell === Player.X){
                marks.push(new X(cell, markParent));
                continue;
            }
            marks.push(new O(cell, markParent));
        }
        if(winner){
            grid.displayWinner(winner);
        }
    }

    private removeTicTacToe(tictactoe: TicTacToeImpl<TTheme>): void {
        const index = this.ticTacToes.indexOf(tictactoe);
        this.ticTacToes.splice(index, 1);
        tictactoe.destroy();
        const cell = tictactoe.gridCell!;
        const possibility = new Possibility(
            cell,
            this.possibilityParent,
            tictactoe.state
        )
        this.possibilities.push(possibility);
    }

    private revealPossibility(possibility: Possibility, tree: GameStateTree, theme: TTheme): void {
        const index = this.possibilities.indexOf(possibility);
        this.possibilities.splice(index, 1);
        possibility.destroy();
        const cell = possibility.cell as GridCell<TTheme>;
        const ticTacToe = new TicTacToeImpl<TTheme>(
            this.parent,
            tree,
            cell.displayGrid(),
            cell,
            theme
        );
        this.ticTacToes.push(ticTacToe);
    }

    public setTree(tree: GameStateTree): void {
        if(tree.equals(this.tree) || this.isWinner){
            return;
        }
        const adjustedTheme = this.tree.winner === tree.winner ? this.theme : calculateAdjustedTheme(tree, this.theme);
        this.theme = adjustedTheme;
        this.grid?.setTheme(adjustedTheme)
        for(let position = 0; position < 9; position++){
            const playerAtCell = this.playersAtPositions[position];
            if(playerAtCell !== 0){
                continue;
            }
            const stateForCell = tree.state.playPosition(position);
            const currentTicTacToeForCell = this.ticTacToes.find(t => t.state.equals(stateForCell));
            const currentPossibilityForCell = this.possibilities.find(p => p.gameState.equals(stateForCell));
            const treeForCell = tree.getForState(stateForCell);
            if(treeForCell){
                if(currentTicTacToeForCell){
                    currentTicTacToeForCell.setTheme(adjustedTheme);
                    currentTicTacToeForCell.setTree(treeForCell);
                }else if(currentPossibilityForCell){
                    this.revealPossibility(currentPossibilityForCell, treeForCell, adjustedTheme);
                }
            }else{
                if(currentTicTacToeForCell){
                    this.removeTicTacToe(currentTicTacToeForCell);
                }
            }
        }
        this.tree = tree;
    }

    public setTheme(theme: TTheme): void {
        const adjustedTheme = calculateAdjustedTheme(this.tree, theme);
        this.theme = adjustedTheme;
        this.grid?.setTheme(adjustedTheme)
        this.ticTacToes.forEach((tictactoe) => tictactoe.setTheme(adjustedTheme))
    }

    public destroy(): void {
        this.ticTacToes.forEach(t => t.destroy());
        this.possibilities.forEach(p => p.destroy())
        this.marks.forEach(x => x.destroy())
        this.gridCell?.clear()
    }
}