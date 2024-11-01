export interface Renderer {
    rerender(): void
    setRenderable(renderable: Renderable): void
}

export interface Renderable {
    draw(ctx: CanvasRenderingContext2D): void
}