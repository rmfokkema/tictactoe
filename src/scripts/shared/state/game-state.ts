import type { Player } from "../player"
import type { Winner } from "../winner"
import type { EquivalentPositions } from "./equivalent-positions"
import type { GameStateSummary } from "./game-state-summary"

export interface GameState {
    readonly id: number
    getPositions(): Generator<number>
    getEquivalentPositions(): Iterable<EquivalentPositions>
    getNonequivalentSuccessors(): Iterable<GameState>
    getEquivalentWithSameLineage(predecessor: GameState): GameState | undefined
    isPredecessorOf(other: GameState): boolean
    getCanonical(): GameState
    getLastPlayedPosition(): number | undefined
    equals(other: GameState): boolean
    findWinner(): Winner | undefined
    getPlayersAtPositions(): Iterable<Player | 0>
    playPosition(position: number): GameState
    getCurrentPlayer(): Player
    getSummary(): GameStateSummary
}