import { Content } from "./content";
import { Measurements } from "../measurements";
import { ContentImpl } from "./content-impl";
import { Emphasis } from "./emphasis";

export class X extends ContentImpl{
    private readonly emphasis: Content | undefined
    public constructor(
        private readonly measurements: Measurements,
        isLastPlayed: boolean
    ){
        super();
        if(isLastPlayed){
            this.emphasis = new Emphasis(measurements)
        }
    }

    public draw(ctx: CanvasRenderingContext2D): void{
        if(this.emphasis){
            this.emphasis.draw(ctx);
        }
        const {x, y, size} = this.measurements;
        ctx.lineWidth = size / 10;
        ctx.beginPath();
        ctx.moveTo(x + size / 4, y + size / 4);
        ctx.lineTo(x + 3 * size / 4, y + 3 * size / 4);
        ctx.moveTo(x + 3 * size / 4, y + size / 4);
        ctx.lineTo(x + size / 4, y + 3 * size / 4);
        ctx.stroke();
    }
}