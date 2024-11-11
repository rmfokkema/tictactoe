import { Theme } from "../../themes";
import { getSection, getSide, GridBorderPart, GridBorderSection, GridBorderSide } from "./grid-border-part";
import { LineSegmentImpl } from "./line-segment-impl";
import { GridBorderMeasurements, LineSegment, LineSegmentMeasurements } from "./types";


class BorderSection {
    private leftTheme: Theme
    private rightTheme: Theme

    public get theme(): Theme {return this.leftTheme === this.rightTheme ? this.leftTheme : this.borderTheme;}
    public constructor(
        public readonly start: number,
        public readonly end: number,
        private borderTheme: Theme
    ){
        this.leftTheme = borderTheme;
        this.rightTheme = borderTheme;
    }

    public setBorderTheme(theme: Theme): void{
        this.borderTheme = theme;
    }

    public setLeftTheme(theme: Theme): void{
        this.leftTheme = theme;
    }

    public setRightTheme(theme: Theme): void{
        this.rightTheme = theme;
    }
}

export class GridBorder{
    private lineSegments: LineSegment[]
    private readonly beginning: BorderSection;
    private readonly middle: BorderSection;
    private readonly end: BorderSection;
    public constructor(
        private readonly measurements: GridBorderMeasurements,
        private theme: Theme
    ){
        this.lineSegments = [new LineSegmentImpl(measurements.lineSegment)];
        this.beginning = new BorderSection(
            measurements.lineSegment.start,
            measurements.intersection1 - measurements.lineWidth / 2,
            theme
        );
        this.middle = new BorderSection(
            measurements.intersection1 - measurements.lineWidth / 2,
            measurements.intersection2 + measurements.lineWidth / 2,
            theme
        );
        this.end = new BorderSection(
            measurements.intersection2 + measurements.lineWidth / 2,
            measurements.lineSegment.end,
            theme
        )
    }

    private createLineSegment(start: number, end: number, theme: Theme): LineSegment{
        const result = new LineSegmentImpl({
            start,
            end,
            position: this.measurements.lineSegment.position,
            direction: this.measurements.lineSegment.direction
        })
        if(theme === this.theme){
            return result;
        }
        return result.themed(theme);
    }

    private setLineSegments(): void{
        const segments: LineSegment[] = [];
        const beginningTheme = this.beginning.theme;
        const middleTheme = this.middle.theme;
        const endTheme = this.end.theme;
        if(beginningTheme !== middleTheme){
            segments.push(this.createLineSegment(this.beginning.start, this.beginning.end, beginningTheme));
            if(middleTheme !== endTheme){
                segments.push(this.createLineSegment(this.middle.start, this.middle.end, middleTheme))
                segments.push(this.createLineSegment(this.end.start, this.end.end, endTheme));
            }else{
                segments.push(this.createLineSegment(this.middle.start, this.end.end, middleTheme))
            }
        }else{
            if(middleTheme !== endTheme){
                segments.push(this.createLineSegment(this.beginning.start, this.middle.end, middleTheme))
                segments.push(this.createLineSegment(this.end.start, this.end.end, endTheme))
            }else{
                segments.push(this.createLineSegment(this.beginning.start, this.end.end, middleTheme))
            }
        }
        this.lineSegments = segments;
    }

    public setTheme(theme: Theme): void{
        this.theme = theme;
        this.beginning.setBorderTheme(theme);
        this.middle.setBorderTheme(theme);
        this.end.setBorderTheme(theme);
        this.setLineSegments();
    }

    public setPartialTheme(part: GridBorderPart, theme: Theme){
        const section = getSection(part)
        const side = getSide(part)
        const borderSection = section === GridBorderSection.Beginning ? this.beginning : section === GridBorderSection.Middle ? this.middle : this.end;
        if(side === GridBorderSide.Left){
            borderSection.setLeftTheme(theme);
        }else{
            borderSection.setRightTheme(theme);
        }
        this.setLineSegments();
    }

    public draw(ctx: CanvasRenderingContext2D): void{
        this.lineSegments.forEach(s => s.draw(ctx))
    }
}