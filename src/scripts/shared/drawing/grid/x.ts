import { getMarkLineWidth } from "./grid-measurements";
import type { Measurements, Point } from '../measurements'
import type { Theme } from "../theme";
import { type Three, isInColumn, isInRow, isMainDiagonal } from "../../three";
import type { Mark } from "./mark";
import type { Drawing } from "../drawing";

export class X implements Mark {
    private readonly lineWidth: number;
    public constructor(
        private readonly measurements: Measurements,
        private theme: Theme
    ){
        this.lineWidth = getMarkLineWidth(measurements.width);
    }

    public setTheme(theme: Theme): void {
        this.theme = theme;
    }

    public draw(drawing: Drawing): void {
        const {x, y, width: size} = this.measurements;
        drawing.save();
        drawing.setLineWidth(this.lineWidth);
        drawing.setLineColor(this.theme.color);
        drawing.addLine(x + size / 4, y + size / 4, x + 3 * size / 4, y + 3 * size / 4);
        drawing.addLine(x + 3 * size / 4, y + size / 4, x + size / 4, y + 3 * size / 4);
        drawing.restore();
    }

    public getWinStart(three: Three): Point{
        const {x, y, width: size} = this.measurements;
        if(isInRow(three)){
            return {x: x + size * (1 - 1 / Math.sqrt(2)) / 2, y: y + size / 2}
        }
        if(isInColumn(three)){
            return {x: x + size / 2, y: y + size * (1 - 1 / Math.sqrt(2)) / 2}
        }
        if(isMainDiagonal(three)){
            return {x: x + size / 4, y: y + size / 4}
        }
        return {x: x + 3 * size / 4, y: y + size / 4}
    }

    public getWinEnd(three: Three): Point{
        const {x, y, width: size} = this.measurements;
        if(isInRow(three)){
            return {x: x + size * (1 + 1 / Math.sqrt(2)) / 2, y: y + size / 2}
        }
        if(isInColumn(three)){
            return {x: x + size / 2, y: y + size * (1 + 1 / Math.sqrt(2)) / 2}
        }
        if(isMainDiagonal(three)){
            return {x: x + 3 * size / 4, y: y + 3 * size / 4}
        }
        return {x: x + size / 4, y: y + 3 * size / 4}
    }
}