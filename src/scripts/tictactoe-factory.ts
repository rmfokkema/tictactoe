import { Content } from "./content";
import { Measurements } from "./measurements";

export type TicTacToeFactory = (
    measurements: Measurements,
    gameState: number,
    player: number
) => Content