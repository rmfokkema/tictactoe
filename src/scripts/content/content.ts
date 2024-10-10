export interface ContentParent{
    triggerChange(): void
}

export interface Content{
    draw(ctx: CanvasRenderingContext2D): void
    willHandleClick(x: number, y: number): boolean
    handleClick(x: number, y: number): void
}