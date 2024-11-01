import { getMarkLineWidth, Measurements } from "../measurements";

export abstract class MarkImpl {
    protected readonly lineWidth: number;
    public constructor(
        protected readonly measurements: Measurements
    ){
        this.lineWidth = getMarkLineWidth(measurements.size);
    }
}