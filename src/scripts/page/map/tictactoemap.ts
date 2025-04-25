import type { EventTargetLike } from "../events/types"
import type { Theme, Grid } from "../ui"
import type { MapRendererEventMap, StateRenderer } from "./map-renderer"
import type { RenderedMap } from "./rendered-map"

export interface TicTacToeMap {
    renderOnGrid<TTheme extends Theme>(
        grid: Grid<TTheme>
    ): RenderedMap<TTheme>
    load(): Promise<void>
    addStateRenderer(renderer: StateRenderer & EventTargetLike<MapRendererEventMap>): void
}