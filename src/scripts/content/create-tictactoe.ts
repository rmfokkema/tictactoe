import { GameState } from "../state/game-state";
import { Measurements } from "../measurements";
import { Renderer } from "../renderer/types";
import { RevealedPosition } from "../state/revealed-position";
import { Theme } from "../themes";
import { TicTacToe, TicTacToeParent } from "./tictactoe";
import { CustomPointerEventTarget } from "../events/types";

class RootTicTacToeParent implements TicTacToeParent {
    private ticTacToe: TicTacToe | undefined;

    public notifyRevealedPosition({gameState, winner}: RevealedPosition): void{
        if(!this.ticTacToe){
            return;
        }
        this.ticTacToe.showPosition({gameState, winner})
    }

    public createTicTacToe(
        eventTarget: CustomPointerEventTarget,
        renderer: Renderer,
        measurements: Measurements,
        theme: Theme,
        gameState: GameState
    ): TicTacToe {
        const ticTacToe = new TicTacToe(
            this,
            eventTarget,
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
    eventTarget: CustomPointerEventTarget,
    renderer: Renderer,
    measurements: Measurements,
    theme: Theme,
    gameState: GameState
): TicTacToe{
    const parent = new RootTicTacToeParent();
    return parent.createTicTacToe(
        eventTarget,
        renderer,
        measurements,
        theme,
        gameState
    )
}