import type { Point } from "../measurements";
import type { Theme } from "../theme";
import { BorderDirection, type LineSegment, type LineSegmentMeasurements } from "./grid-measurements";
import type { Drawing } from "../drawing";

function getStartAndEnd({
    direction,
    position,
    start,
    end
}: LineSegmentMeasurements): {start: Point, end: Point}{
    if(direction === BorderDirection.Vertical){
        return {
            start: {
                x: position,
                y: start
            },
            end: {
                x: position,
                y: end
            }
        }
    }
    return {
        start: {
            x: start,
            y: position
        },
        end: {
            x: end,
            y: position
        }
    }
}

class ThemedLineSegment implements LineSegment{
    public constructor(
        private readonly lineSegment: LineSegment,
        private readonly theme: Theme){}


    public draw(drawing: Drawing): void{
        drawing.save();
        drawing.setLineColor(this.theme.color);
        this.lineSegment.draw(drawing);
        drawing.restore();
    }

    public themed(theme: Theme): LineSegment {
        return this.lineSegment.themed(theme);
    }
}
export class LineSegmentImpl implements LineSegment{
    private readonly start: Point;
    private readonly end: Point
    public constructor(
        measurements: LineSegmentMeasurements
    ){
        const {start, end} = getStartAndEnd(measurements)
        this.start = start;
        this.end = end;
    }

    public themed(theme: Theme): LineSegment {
        return new ThemedLineSegment(this, theme);
    }

    public draw(drawing: Drawing): void {
        drawing.addLine(this.start.x, this.start.y, this.end.x, this.end.y);
    }
}