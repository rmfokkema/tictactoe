import { BorderDirection } from "./border-direction";

export interface LineSegmentMeasurements{
    direction: BorderDirection;
    position: number;
    start: number;
    end: number;
}