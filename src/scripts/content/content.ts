export interface Content{
    draw(ctx: CanvasRenderingContext2D): void
    willHandleClick(x: number, y: number): boolean
    handleClick(x: number, y: number): Content | undefined
    onChange(callback: () => void): void
}