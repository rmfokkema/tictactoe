import type { Drawing } from "./drawing";

export interface Drawable {
    draw(drawing: Drawing): void
}