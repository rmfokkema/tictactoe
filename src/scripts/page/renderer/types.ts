import type { InfiniteCanvasRenderingContext2D } from "ef-infinite-canvas"

export interface Rerenderer {
    rerender(): void
}
export interface Renderer extends Rerenderer {
    setRenderable(renderable: Renderable): void
}

export interface Renderable {
    draw(ctx: InfiniteCanvasRenderingContext2D): void
}