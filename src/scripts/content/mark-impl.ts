import { getMarkLineWidth, Measurements } from "../measurements";
import { Content, ContentParent } from "./content";
import { ContentImpl } from "./content-impl";
import { Emphasis } from "./emphasis";

export abstract class MarkImpl extends ContentImpl {
    private readonly emphasis: Content | undefined
    protected readonly lineWidth: number;
    public constructor(
        parent: ContentParent,
        protected readonly measurements: Measurements,
        isLastPlayed: boolean
    ){
        super(parent);
        if(isLastPlayed){
            this.emphasis = new Emphasis(this, measurements)
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