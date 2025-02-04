import { GameState } from "../state/game-state";
import { RevealedPosition } from "../state/revealed-position";
import { Theme } from "../themes";
import { Grid } from "../ui/grid";
import { TicTacToeImpl, TicTacToeParent } from "./tictactoe-impl";
import { EventDispatcher } from "../events/event-dispatcher";
import { MapEventMap, MapStore } from "../store/map-store";

export interface TicTacToeRoot extends MapStore {

}

export function createTicTacToeRoot(
    grid: Grid,
    theme: Theme
): TicTacToeRoot {
    const eventDispatcher: EventDispatcher<MapEventMap> = new EventDispatcher({
        statehidden: [],
        positionrevealed: []
    });
    const parent: TicTacToeParent = {
        notifyRevealedPosition(position: RevealedPosition): void {
            impl.revealPosition(position);
            eventDispatcher.dispatchEvent('positionrevealed', position);
        },
        notifyHiddenState(state: GameState): void {
            impl.hideState(state);
            eventDispatcher.dispatchEvent('statehidden', state);
        }
    };
    const impl = new TicTacToeImpl(
        parent,
        GameState.initial,
        undefined,
        theme,
        grid,
        undefined
    );
    return {
        hideState(state: GameState): void {
            impl.hideState(state);
        },
        revealPosition(position: RevealedPosition): void {
            impl.revealPosition(position);
        },
        addEventListener<TType extends keyof MapEventMap>(type: TType, listener: (ev: MapEventMap[TType]) => void): void {
            eventDispatcher.addEventListener(type, listener);
        },
        removeEventListener<TType extends keyof MapEventMap>(type: TType, listener: (ev: MapEventMap[TType]) => void): void {
            eventDispatcher.removeEventListener(type, listener);
        }
    };
}