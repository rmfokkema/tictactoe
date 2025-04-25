import type { GameState } from "@shared/state/game-state";

export interface SelectionEventMap {
    stateselected: GameState
    unselected: void
}