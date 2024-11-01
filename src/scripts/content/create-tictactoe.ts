import { GameState } from "../game-state";
import { Measurements } from "../measurements";
import { Theme } from "../themes";
import { ContentParent } from "./content";
import { ContentRoot } from "./content-root";
import { TicTacToe, TicTacToeParent } from "./tictactoe";

class RootTicTacToeParent implements TicTacToeParent {
    public constructor(
        private readonly parent: ContentParent
    ){

    }

    public triggerChange(): void {
        this.parent.triggerChange();
    }

    public addChild(): void {

    }

    public notifyWinner(): void {
        
    }
}
export function createTicTacToe(
    measurements: Measurements,
    theme: Theme,
    gameState: GameState
): ContentRoot<TicTacToe>{
    return ContentRoot.create((parent) => new TicTacToe(new RootTicTacToeParent(parent), measurements, theme, gameState, undefined))
}