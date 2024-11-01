import { Theme } from "../../themes";
import { createLineSegment } from "./line-segment-impl";
import { LineSegment, LineSegmentMeasurements } from "./types";

export class GridBorder{
    public constructor(
        private readonly lineSegment: LineSegment
    ){

    }

    public setTheme(theme: Theme): void{
        this.lineSegment.setTheme(theme);
    }

    public draw(ctx: CanvasRenderingContext2D): void{
        this.lineSegment.draw(ctx);
    }

    public static create(measurements: LineSegmentMeasurements, theme: Theme): GridBorder{
        return new GridBorder(createLineSegment(measurements, theme))
    }
}