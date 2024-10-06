import { Content } from "./content";
import { GameState } from "./game-state";
import { Measurements } from "./measurements";

export type TicTacToeFactory = (
    measurements: Measurements,
    gameState: GameState
) => Content