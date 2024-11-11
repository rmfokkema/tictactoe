import { Theme } from "../../themes";
import { GridBorder } from "./grid-border";
import { GridBorderPart } from "./grid-border-part";
import { GridBuilder } from "./grid-builder";
import { GridCellBorder } from "./grid-cell-border";
import { GridCellMeasurements } from "./types";

export interface Cell {
    measurements: GridCellMeasurements
    setTheme(theme: Theme): void
}

class GridCell implements Cell {
    private theme: Theme;
    public constructor(
        public readonly measurements: GridCellMeasurements,
        private readonly borders: GridCellBorder[],
        private gridTheme: Theme
    ){
        this.theme = gridTheme;
    }

    public setTheme(theme: Theme): void{
        this.theme = theme;
        this.borders.forEach(b => b.setTheme(theme))
    }

    public setGridTheme(theme: Theme){
        this.gridTheme = theme;
    }

    public draw(ctx: CanvasRenderingContext2D): void{
        if(this.theme === this.gridTheme){
            return;
        }
        const {x, y, size, background: {extendLeft, extendRight, extendTop, extendBottom }} = this.measurements;
        ctx.fillStyle = this.theme.backgroundColor;
        ctx.fillRect(
            x - extendLeft,
            y - extendTop,
            size + extendLeft + extendRight,
            size + extendTop + extendBottom
        );
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
        measurements: GridCellMeasurements,
        private theme: Theme
    ){
        const builder = new GridBuilder(measurements);
        this.leftVerticalBorder = new GridBorder(builder.getLeftVertical(), theme);
        this.rightVerticalBorder = new GridBorder(builder.getRightVertical(), theme);
        this.topHorizontalBorder = new GridBorder(builder.getTopHorizontal(), theme);
        this.bottomHorizontalBorder = new GridBorder(builder.getBottomHorizontal(), theme);
        const cellMeasurements = [...builder.getCellMeasurements()];
        this.gridCells = [
            new GridCell(
                cellMeasurements[0],
                [
                    new GridCellBorder(this.leftVerticalBorder, GridBorderPart.BeginningRight),
                    new GridCellBorder(this.topHorizontalBorder, GridBorderPart.BeginningLeft),
                ],
                theme
            ),
            new GridCell(
                cellMeasurements[1],
                [
                    new GridCellBorder(this.leftVerticalBorder, GridBorderPart.BeginningLeft),
                    new GridCellBorder(this.rightVerticalBorder, GridBorderPart.BeginningRight),
                    new GridCellBorder(this.topHorizontalBorder, GridBorderPart.MiddleLeft),
                ],
                theme
            ),
            new GridCell(
                cellMeasurements[2],
                [
                    new GridCellBorder(this.rightVerticalBorder, GridBorderPart.BeginningLeft),
                    new GridCellBorder(this.topHorizontalBorder, GridBorderPart.EndLeft),
                ],
                theme
            ),
            new GridCell(
                cellMeasurements[3],
                [
                    new GridCellBorder(this.topHorizontalBorder, GridBorderPart.BeginningRight),
                    new GridCellBorder(this.leftVerticalBorder, GridBorderPart.MiddleRight),
                    new GridCellBorder(this.bottomHorizontalBorder, GridBorderPart.BeginningLeft),
                ],
                theme
            ),
            new GridCell(
                cellMeasurements[4],
                [
                    new GridCellBorder(this.topHorizontalBorder, GridBorderPart.MiddleRight),
                    new GridCellBorder(this.leftVerticalBorder, GridBorderPart.MiddleLeft),
                    new GridCellBorder(this.rightVerticalBorder, GridBorderPart.MiddleRight),
                    new GridCellBorder(this.bottomHorizontalBorder, GridBorderPart.MiddleLeft),
                ],
                theme
            ),
            new GridCell(
                cellMeasurements[5],
                [
                    new GridCellBorder(this.topHorizontalBorder, GridBorderPart.EndRight),
                    new GridCellBorder(this.rightVerticalBorder, GridBorderPart.MiddleLeft),
                    new GridCellBorder(this.bottomHorizontalBorder, GridBorderPart.EndLeft),
                ],
                theme
            ),
            new GridCell(
                cellMeasurements[6],
                [
                    new GridCellBorder(this.leftVerticalBorder, GridBorderPart.EndRight),
                    new GridCellBorder(this.bottomHorizontalBorder, GridBorderPart.BeginningRight),
                ],
                theme
            ),
            new GridCell(
                cellMeasurements[7],
                [
                    new GridCellBorder(this.leftVerticalBorder, GridBorderPart.EndLeft),
                    new GridCellBorder(this.rightVerticalBorder, GridBorderPart.EndRight),
                    new GridCellBorder(this.bottomHorizontalBorder, GridBorderPart.MiddleRight),
                ],
                theme
            ),
            new GridCell(
                cellMeasurements[8],
                [
                    new GridCellBorder(this.rightVerticalBorder, GridBorderPart.EndLeft),
                    new GridCellBorder(this.bottomHorizontalBorder, GridBorderPart.EndRight),
                ],
                theme
            ),
        ];
        this.lineWidth = builder.lineWidth;
        this.cellSize = builder.cellSize;
    }

    public setTheme(theme: Theme): void{
        this.theme = theme;
        this.leftVerticalBorder.setTheme(theme);
        this.rightVerticalBorder.setTheme(theme);
        this.topHorizontalBorder.setTheme(theme);
        this.bottomHorizontalBorder.setTheme(theme);
        this.gridCells.forEach(c => c.setGridTheme(theme))
        this.gridCells.forEach(c => c.setTheme(theme))
    }

    public drawCells(ctx: CanvasRenderingContext2D) {
        this.gridCells.forEach(c => c.draw(ctx))
    }

    public drawBorders(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.theme.color;
        this.leftVerticalBorder.draw(ctx);
        this.rightVerticalBorder.draw(ctx);
        this.topHorizontalBorder.draw(ctx);
        this.bottomHorizontalBorder.draw(ctx);
        ctx.restore();
    }
}