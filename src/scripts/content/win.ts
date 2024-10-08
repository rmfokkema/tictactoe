import { ContentImpl } from "./content-impl";

export class Win extends ContentImpl{
    public constructor(
        private readonly x1: number,
        private readonly x2: number,
        private readonly y1: number,
        private readonly y2: number,
        private readonly lineWidth: number
    ){
        super();
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.lineWidth = this.lineWidth;
        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.stroke();
    }
}