import type { Measurements } from '@shared/drawing'

export interface ScreenMeasurements {
    width: number
    height: number
}

export function measurementsInclude(measurements: Measurements, x: number, y: number){
    const {x: left, y: top, width, height } = measurements;
    return x > left && x < left + width && y > top && y < top + height;
}

export function getMarkLineWidth(cellSize: number): number{
    return cellSize / (7 * Math.sqrt(2));
}