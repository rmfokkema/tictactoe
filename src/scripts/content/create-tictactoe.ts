import { GameState } from "../state/game-state";
import { Measurements } from "../measurements";
import { Renderer } from "../renderer/types";
import { RevealedPosition } from "../state/revealed-position";
import { Theme } from "../themes";
import { TicTacToe, TicTacToeParent } from "./tictactoe";
import { CustomPointerEventTarget } from "../events/types";

class RootTicTacToeParent implements TicTacToeParent {
    private ticTacToe: TicTacToe | undefined;

    public constructor(
        private readonly renderer: Renderer
    ){}

    public notifyRevealedPosition({gameState, winner}: RevealedPosition): void{
        if(!this.ticTacToe){
            return;
        }
        this.ticTacToe.showPosition({gameState, winner})
        this.renderer.rerender();
    }

    public notifyHiddenState(state: GameState): void {
        if(!this.ticTacToe){
            return;
        }
        this.ticTacToe.hideState(state)
        this.renderer.rerender();
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
    const parent = new RootTicTacToeParent(renderer);
    return parent.createTicTacToe(
        eventTarget,
        renderer,
        measurements,
        theme,
        gameState
    )
}