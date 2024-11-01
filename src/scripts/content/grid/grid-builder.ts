import { Measurements } from "../../measurements";
import { BorderDirection } from "./border-direction";
import { LineSegmentMeasurements } from "./line-segment-measurements";

export class GridBuilder {
    private readonly vertical1: number
    private readonly vertical2: number
    private readonly horizontal1: number
    private readonly horizontal2: number
    public readonly lineWidth: number;
    public readonly cellSize: number;
    public constructor(
        private readonly measurements: Measurements
    ){
        const { size, x, y } = measurements;
        const lineWidth = this.lineWidth = size / 100;
        const cellSize = this.cellSize = (size - 2 * lineWidth) / 3;
        const right = x + size;
        const bottom = y + size;
        this.vertical1 = x + cellSize + lineWidth / 2;
        this.vertical2 = right - cellSize - lineWidth / 2;
        this.horizontal1 = y + cellSize + lineWidth / 2;
        this.horizontal2 = bottom - cellSize - lineWidth / 2;
    }
    public *getCellMeasurements(): Iterable<Measurements>{
        const {x, y, size: parentSize} = this.measurements;
        const size = (parentSize - 2 * this.lineWidth) / 3;
        const halfLineWidth = this.lineWidth / 2;
        const columnXes = [x, this.vertical1 + halfLineWidth, this.vertical2 + halfLineWidth];
        const rowYs = [y, this.horizontal1 + halfLineWidth, this.horizontal2 + halfLineWidth];
        for(let rowIndex = 0; rowIndex < 3; rowIndex++){
            for(let columnIndex = 0; columnIndex < 3; columnIndex++){
                yield {
                    x: columnXes[columnIndex],
                    y: rowYs[rowIndex],
                    size
                }
            }
        }
    }
    public getLeftVertical(): LineSegmentMeasurements {
        return {
            direction: BorderDirection.Vertical,
            position: this.vertical1,
            start: this.measurements.y,
            end: this.measurements.y + this.measurements.size
        }
    }
    public getRightVertical(): LineSegmentMeasurements {
        return {
            direction: BorderDirection.Vertical,
            position: this.vertical2,
            start: this.measurements.y,
            end: this.measurements.y + this.measurements.size
        };
    }
    public getTopHorizontal(): LineSegmentMeasurements{
        return {
            direction: BorderDirection.Horizontal,
            position: this.horizontal1,
            start: this.measurements.x,
            end: this.measurements.x + this.measurements.size,
        }
    }
    public getBottomHorizontal(): LineSegmentMeasurements{
        return {
            direction: BorderDirection.Horizontal,
            position: this.horizontal2,
            start: this.measurements.x,
            end: this.measurements.x + this.measurements.size
        }
    }
}