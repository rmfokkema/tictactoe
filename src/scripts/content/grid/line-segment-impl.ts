import { Theme } from "../../themes";
import { BorderDirection, LineSegment, LineSegmentMeasurements } from "./types";

class VerticalLineSegment implements LineSegment {
    public constructor(
        private readonly x: number,
        private readonly y1: number,
        private readonly y2: number,
        private theme: Theme
    ){

    }

    public setTheme(theme: Theme): void {
        this.theme = theme;
    }

    public draw(ctx: CanvasRenderingContext2D): void{
        ctx.strokeStyle = this.theme.color;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y1);
        ctx.lineTo(this.x, this.y2);
        ctx.stroke();
    }
}

class HorizontalLineSegment implements LineSegment{
    public constructor(
        private readonly y: number,
        private readonly x1: number,
        private readonly x2: number,
        private theme: Theme
    ){

    }

    public setTheme(theme: Theme): void {
        this.theme = theme;
    }

    public draw(ctx: CanvasRenderingContext2D): void{
        ctx.strokeStyle = this.theme.color;
        ctx.beginPath();
        ctx.moveTo(this.x1, this.y);
        ctx.lineTo(this.x2, this.y);
        ctx.stroke();
    }
}

export function createLineSegment(
    {
        direction,
        position,
        start,
        end
    }: LineSegmentMeasurements,
    theme: Theme
): LineSegment {
    if(direction === BorderDirection.Vertical){
        return new VerticalLineSegment(position, start, end, theme);
    }
    return new HorizontalLineSegment(position, start, end, theme)
}