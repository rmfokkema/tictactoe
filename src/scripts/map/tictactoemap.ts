import { Theme } from "../themes"
import { Grid } from "../ui/grid"

export interface TicTacToeMap {
    renderOnGrid(
        grid: Grid,
        theme: Theme
    ): void
    load(): void
}