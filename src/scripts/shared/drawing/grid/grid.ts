import type { Winner } from "../../winner"
import type { Theme } from "../theme"
import type { Drawable } from "../drawable"
import type { Measurements } from "../measurements"

export interface Slot {
    clear(): void
}
export interface MarkSlot extends Slot {
    displayX(): void
    displayO(): void
}
export interface GridSlot extends Slot {
    displayGrid(): Grid
}
export interface GridCell extends MarkSlot, GridSlot {
    measurements: Measurements
}

export interface Grid extends Drawable {
    theme: Theme
    setTheme(theme: Theme): void
    cells: readonly [
        GridCell,
        GridCell,
        GridCell,
        GridCell,
        GridCell,
        GridCell,
        GridCell,
        GridCell,
        GridCell,
    ]
    displayWinner(winner: Winner | undefined): void
}