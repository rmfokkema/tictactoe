import { getMarkLineWidth, Measurements } from "../measurements";
import { Content } from "./content";
import { ContentImpl } from "./content-impl";
import { Emphasis } from "./emphasis";

export abstract class MarkImpl extends ContentImpl {
    private readonly emphasis: Content | undefined
    protected readonly lineWidth: number;
    public constructor(
        protected readonly measurements: Measurements,
        isLastPlayed: boolean
    ){
        super();
        if(isLastPlayed){
            this.emphasis = new Emphasis(measurements)
        }
        this.lineWidth = getMarkLineWidth(measurements.size);
    }

    protected abstract drawMark(ctx: CanvasRenderingContext2D): void

    public draw(ctx: CanvasRenderingContext2D): void {
        if(this.emphasis){
            this.emphasis.draw(ctx);
        }
        this.drawMark(ctx)
    }
}