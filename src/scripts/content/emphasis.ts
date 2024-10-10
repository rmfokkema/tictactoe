import { emphasisColor } from "../colors";
import { Measurements } from "../measurements";
import { ContentParent } from "./content";
import { ContentImpl } from "./content-impl";

export class Emphasis extends ContentImpl{
    public constructor(
        parent: ContentParent,
        private readonly measurements: Measurements
    ){
        super(parent);
    }

    public draw(ctx: CanvasRenderingContext2D): void{
        const {x, y, size} = this.measurements;
        ctx.fillStyle = emphasisColor;
        ctx.fillRect(x, y, size, size)
    }
}