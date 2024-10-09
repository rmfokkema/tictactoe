import { Point } from "../point";
import { ContentImpl } from "./content-impl";

export class Win extends ContentImpl{
    public constructor(
        private readonly start: Point,
        private readonly end: Point,
        private readonly lineWidth: number
    ){
        super();
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.lineWidth = this.lineWidth;
        ctx.beginPath();
        ctx.moveTo(this.start.x, this.start.y);
        ctx.lineTo(this.end.x, this.end.y);
        ctx.stroke();
    }
}