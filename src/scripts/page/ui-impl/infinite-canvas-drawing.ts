import type { InfiniteCanvasRenderingContext2D } from "ef-infinite-canvas";
import type { Drawing } from "@shared/drawing";

export function createInfiniteCanvasDrawing(
    ctx: InfiniteCanvasRenderingContext2D
): Drawing {
    return {
        setLineWidth(width) {
            ctx.lineWidth = width;
        },
        setLineColor(color) {
            ctx.strokeStyle = color;
        },
        save(){
            ctx.save()
        },
        restore(){
            ctx.restore();
        },
        addRectangle(x, y, width, height, color) {
            ctx.fillStyle = color;
            ctx.fillRect(x, y, width, height);
        },
        addLine(fromX, fromY, toX, toY) {
            ctx.beginPath();
            ctx.moveTo(fromX, fromY);
            ctx.lineTo(toX, toY);
            ctx.stroke();
        },
        addCircle(cx, cy, r) {
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, 2 * Math.PI);
            ctx.stroke();
        },
    }
}