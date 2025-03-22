import type { Measurements } from "../measurements";
import type { Drawable } from "../drawable";
import type { Theme } from "../theme"

export enum BorderDirection { Vertical, Horizontal }

export interface LineSegment extends Drawable{
    themed(theme: Theme): LineSegment
}

export interface GridBorderMeasurements {
    lineSegment: LineSegmentMeasurements
    intersection1: number
    intersection2: number
    lineWidth: number
}

export interface LineSegmentMeasurements{
    direction: BorderDirection;
    position: number;
    start: number;
    end: number;
    lineWidth: number;
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

export function getMarkLineWidth(cellSize: number): number{
    return cellSize / (7 * Math.sqrt(2));
}