import { Measurements } from "../../measurements";
import { Theme } from "../../themes"

export enum BorderDirection { Vertical, Horizontal }

export interface LineSegment {
    draw(ctx: CanvasRenderingContext2D): void
    setTheme(theme: Theme): void
}

export interface LineSegmentMeasurements{
    direction: BorderDirection;
    position: number;
    start: number;
    end: number;
}

export interface GridCellBackgroundMeasurements {
    extendLeft: number
    extendRight: number
    extendTop: number
    extendBottom: number
}

export interface GridCellMeasurements extends Measurements{
    background: GridCellBackgroundMeasurements
}