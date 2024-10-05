import { Content } from "./content";
import { Measurements } from "./measurements";

export class Tic implements Content{
    public constructor(
        private readonly measurements: Measurements
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
        ctx.lineWidth = size / 10;
        ctx.beginPath();
        ctx.moveTo(x + size / 4, y + size / 4);
        ctx.lineTo(x + 3 * size / 4, y + 3 * size / 4);
        ctx.moveTo(x + 3 * size / 4, y + size / 4);
        ctx.lineTo(x + size / 4, y + 3 * size / 4);
        ctx.stroke();
    }
}