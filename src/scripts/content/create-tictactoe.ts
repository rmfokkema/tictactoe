import { ClickHandlerNode } from "../events/types";
import { GameState } from "../state/game-state";
import { Measurements } from "../measurements";
import { Renderer } from "../renderer/types";
import { RevealedPosition } from "../state/revealed-position";
import { Theme } from "../themes";
import { TicTacToe, TicTacToeParent } from "./tictactoe";

class RootTicTacToeParent implements TicTacToeParent {
    private ticTacToe: TicTacToe | undefined;
    public constructor(
        
    ){

    }

    public notifyRevealedPosition({gameState, winner}: RevealedPosition): void{
        console.log(`'position revealed: ${gameState}'`)
        if(!this.ticTacToe){
            return;
        }
        this.ticTacToe.showPosition({gameState, winner})
    }

    public createTicTacToe(
        clickHandler: ClickHandlerNode,
        renderer: Renderer,
        measurements: Measurements,
        theme: Theme,
        gameState: GameState
    ): TicTacToe {
        const ticTacToe = new TicTacToe(
            this,
            clickHandler,
            renderer,
            {
                ...measurements,
                background: {
                    extendLeft: 0,
                    extendRight: 0,
                    extendTop: 0,
                    extendBottom: 0
                }
            },
            theme,
            gameState,
            undefined,
            undefined
        )
        this.ticTacToe = ticTacToe;
        return ticTacToe;
    }
}
export function createTicTacToe(
    clickHandler: ClickHandlerNode,
    renderer: Renderer,
    measurements: Measurements,
    theme: Theme,
    gameState: GameState
): TicTacToe{
    const parent = new RootTicTacToeParent();
    return parent.createTicTacToe(
        clickHandler,
        renderer,
        measurements,
        theme,
        gameState
    )
}