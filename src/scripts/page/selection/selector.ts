import type { GameState } from "@shared/state/game-state";
import type { EventTargetLike } from "../events/types";
import type { SelectionEventMap } from "./selection-event-map";

export interface Selector {
    select(state: GameState): void
    unselect(): void
}

export interface RenderedSelection extends Selector, EventTargetLike<SelectionEventMap> {

}