import { emphasisColor } from "./colors";
import { Content } from "./content";
import { Measurements } from "./measurements";

export class Tac implements Content {
    public constructor(
        private readonly measurements: Measurements,
        private readonly isLastPlayed: boolean
    ){
        
    }

    public willHandleClick(): boolean {
        return false;
    }

    public onChange(): void {
        
    }

    public handleClick(): undefined{

    }

    public draw(ctx: CanvasRenderingContext2D): void{
        const {x, y, size} = this.measurements;
        ctx.save()
        if(this.isLastPlayed){
            ctx.fillStyle = emphasisColor;
            ctx.fillRect(x, y, size, size)
        }
        ctx.lineWidth = size / 10;
        ctx.beginPath();
        ctx.arc(x + size / 2, y + size / 2, size / 4, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.restore()
    }
}