import { Renderable, Renderer } from "./types";

export function createRenderer(
    ctx: CanvasRenderingContext2D
): Renderer {
    let drawRequested = false;
    let renderable: Renderable | undefined;
    return {
        rerender,
        setRenderable
    };
    function setRenderable(value: Renderable): void{
        renderable = value;
    }
    function rerender(): void{
        if(drawRequested){
            return;
        }
        requestAnimationFrame(() => {
            renderable?.draw(ctx);
            drawRequested = false;
        })
        drawRequested = true;
    }
}