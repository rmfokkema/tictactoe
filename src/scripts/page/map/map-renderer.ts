import type { GameState } from "@shared/state/game-state"
import type { GameStateTree } from "@shared/state/game-state-tree"

export interface MapRendererEventMap {
    statehidden: GameState
    staterevealed: GameState
}

export interface StateRenderer {
    hideState(state: GameState): void
    revealState(state: GameState): void
}

export interface MapRenderer {
    setTree(tree: GameStateTree): void
}