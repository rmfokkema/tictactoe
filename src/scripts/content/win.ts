import { Point } from "../point";
import { Theme } from "../themes";
import { ContentParent } from "./content";
import { ContentImpl } from "./content-impl";

export class Win extends ContentImpl{
    public constructor(
        parent: ContentParent,
        private theme: Theme,
        private readonly start: Point,
        private readonly end: Point,
        private readonly lineWidth: number
    ){
        super(parent);
    }

    public setTheme(theme: Theme): void{
        this.theme = theme;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.lineWidth = this.lineWidth;
        ctx.save();
        ctx.strokeStyle = this.theme.color;
        ctx.beginPath();
        ctx.moveTo(this.start.x, this.start.y);
        ctx.lineTo(this.end.x, this.end.y);
        ctx.stroke();
        ctx.restore();
    }
}