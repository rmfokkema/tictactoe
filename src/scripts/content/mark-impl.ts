import { getMarkLineWidth, Measurements } from "../measurements";
import { ContentParent } from "./content";
import { ContentImpl } from "./content-impl";

export abstract class MarkImpl extends ContentImpl {
    protected readonly lineWidth: number;
    public constructor(
        parent: ContentParent,
        protected readonly measurements: Measurements
    ){
        super(parent);
        this.lineWidth = getMarkLineWidth(measurements.size);
    }

    protected abstract drawMark(ctx: CanvasRenderingContext2D): void

    public draw(ctx: CanvasRenderingContext2D): void {
        this.drawMark(ctx)
    }
}