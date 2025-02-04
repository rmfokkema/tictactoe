import { EventTargetLike } from "../events/types"
import { GameState } from "../state/game-state"
import { RevealedPosition } from "../state/revealed-position"

export interface MapEventMap {
    statehidden: GameState
    positionrevealed: RevealedPosition
}

export interface MapStoreMutations {
    hideState(state: GameState): void
    revealPosition(position: RevealedPosition): void
}

export interface MapStore extends MapStoreMutations, EventTargetLike<MapEventMap> {
    
}