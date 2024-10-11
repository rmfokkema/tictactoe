import { GameState } from "../game-state";
import { Measurements } from "../measurements";
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

    public recordWinner(): void {
        
    }

    public recordLoser(): void {
        
    }
}
export function createTicTacToe(measurements: Measurements, gameState: GameState): ContentRoot<TicTacToe>{
    return ContentRoot.create((parent) => new TicTacToe(new RootTicTacToeParent(parent), measurements, gameState))
}