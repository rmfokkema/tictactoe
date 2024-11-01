import { Measurements } from "../../measurements";
import { Theme } from "../../themes";
import { GridBorder } from "./grid-border";
import { GridBuilder } from "./grid-builder";

export interface Cell {
    measurements: Measurements
    setTheme(theme: Theme): void
    visible: boolean
}

class GridCell implements Cell {
    public constructor(
        public readonly measurements: Measurements,
        private theme: Theme,
        public visible: boolean
    ){

    }

    public setTheme(theme: Theme): void{
        this.theme = theme;
    }

    public draw(ctx: CanvasRenderingContext2D): void{
        if(!this.visible){
            return;
        }
        const {x, y, size} = this.measurements;
        ctx.fillStyle = this.theme.backgroundColor;
        ctx.fillRect(x, y, size, size)
    }
}

export class Grid {
    private readonly gridCells: GridCell[]
    private readonly leftVerticalBorder: GridBorder;
    private readonly rightVerticalBorder: GridBorder;
    private readonly topHorizontalBorder: GridBorder;
    private readonly bottomHorizontalBorder: GridBorder;
    private readonly lineWidth: number;
    public readonly cellSize: number;
    public get cells(): Cell[] {return this.gridCells;}
    public constructor(
        measurements: Measurements,
        theme: Theme
    ){
        const builder = new GridBuilder(measurements);
        this.leftVerticalBorder = GridBorder.create(builder.getLeftVertical(), theme);
        this.rightVerticalBorder = GridBorder.create(builder.getRightVertical(), theme);
        this.topHorizontalBorder = GridBorder.create(builder.getTopHorizontal(), theme);
        this.bottomHorizontalBorder = GridBorder.create(builder.getBottomHorizontal(), theme);
        this.gridCells = [...builder.getCellMeasurements()].map(measurements => new GridCell(measurements, theme, false))
        this.lineWidth = builder.lineWidth;
        this.cellSize = builder.cellSize;
    }

    public setTheme(theme: Theme): void{
        this.leftVerticalBorder.setTheme(theme);
        this.rightVerticalBorder.setTheme(theme);
        this.topHorizontalBorder.setTheme(theme);
        this.bottomHorizontalBorder.setTheme(theme);
        this.gridCells.forEach(c => c.setTheme(theme))
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.lineWidth = this.lineWidth;
        this.gridCells.forEach(c => c.draw(ctx))
        this.leftVerticalBorder.draw(ctx);
        this.rightVerticalBorder.draw(ctx);
        this.topHorizontalBorder.draw(ctx);
        this.bottomHorizontalBorder.draw(ctx);
        ctx.restore();
    }
}