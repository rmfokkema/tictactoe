import { emphasisColor } from "../colors";
import { Measurements } from "../measurements";
import { ContentImpl } from "./content-impl";

export class Emphasis extends ContentImpl{
    public constructor(
        private readonly measurements: Measurements
    ){
        super();
    }

    public draw(ctx: CanvasRenderingContext2D): void{
        const {x, y, size} = this.measurements;
        ctx.fillStyle = emphasisColor;
        ctx.fillRect(x, y, size, size)
    }
}