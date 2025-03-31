import { createCanvas } from 'canvas'
import type { Readable } from 'stream'
import type { Drawing } from '../shared/drawing'

export interface CanvasDrawing extends Drawing {
    getPNGImage(): Readable
}

export function createCanvasDrawing(width: number, height: number): CanvasDrawing {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
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
        getPNGImage(){
            return canvas.createPNGStream();
        }
    }
}