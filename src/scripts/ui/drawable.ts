import { Theme } from "../themes"

export interface Drawable {
    draw(ctx: CanvasRenderingContext2D): void
    setTheme(theme: Theme): void
}