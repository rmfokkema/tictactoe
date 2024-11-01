import { Theme } from "../../themes"

export interface LineSegment {
    draw(ctx: CanvasRenderingContext2D): void
    setTheme(theme: Theme): void
}