import { ClickHandler } from "../events/types"

export interface ContentParent{
    triggerChange(): void
    addChild(child: Content): void
}

export interface Content extends ClickHandler{
    draw(ctx: CanvasRenderingContext2D): void
    destroy(): void
}