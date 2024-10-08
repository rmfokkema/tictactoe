import { Content } from "./content";
import { Measurements } from "../measurements";
import { ContentImpl } from "./content-impl";
import { Emphasis } from "./emphasis";

export class O extends ContentImpl {
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
        ctx.arc(x + size / 2, y + size / 2, size / 4, 0, 2 * Math.PI);
        ctx.stroke();
    }
}