import { ClickHandlerNode } from "../events/types";
import { GameState } from "../game-state";
import { Measurements } from "../measurements";
import { Renderer } from "../renderer/types";
import { Theme } from "../themes";
import { TicTacToe, TicTacToeParent } from "./tictactoe";

class RootTicTacToeParent implements TicTacToeParent {
    public constructor(
        
    ){

    }

    public notifyWinner(): void {
        
    }
}
export function createTicTacToe(
    clickHandler: ClickHandlerNode,
    renderer: Renderer,
    measurements: Measurements,
    theme: Theme,
    gameState: GameState
): TicTacToe{
    return new TicTacToe(
        new RootTicTacToeParent(),
        clickHandler,
        renderer,
        measurements,
        theme,
        gameState,
        undefined
    )
}