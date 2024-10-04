export interface Measurements{
    x: number
    y: number
    size: number
}

export function getInitialMeasurements(totalWidth: number, totalHeight: number): Measurements{
    const size = 2 * Math.min(totalWidth, totalHeight) / 3;
    const x = (totalWidth - size) / 2;
    const y = (totalHeight - size) / 2;
    return {
        x,
        y,
        size
    }
}