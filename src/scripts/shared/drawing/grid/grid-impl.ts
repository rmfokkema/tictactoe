import type { Drawable } from "../drawable";
import type { Theme } from "../theme";
import { GridCellBorder } from "./grid-cell-border";
import { isMark } from "./mark";
import { O } from "./o";
import { type GridCellMeasurements, getMarkLineWidth } from "./grid-measurements";
import { X } from "./x";
import { GridBorder } from "./grid-border";
import { GridBuilder } from "./grid-builder";
import { GridBorderPart } from "./grid-border-part";
import type { Winner } from "../../winner";
import { Win } from "./win";
import type { Measurements } from "../measurements";
import type { Grid, GridCell } from "./grid";
import type { Drawing } from "../drawing";

class GridCellImpl implements GridCell{
    private theme: Theme;
    public content: Drawable | undefined;
    public constructor(
        public readonly measurements: GridCellMeasurements,
        private readonly borders: GridCellBorder[],
        private gridTheme: Theme
    ){
        this.theme = gridTheme;
    }

    private drawBackgroundNew(drawing: Drawing): void {
        if(this.theme === this.gridTheme){
            return;
        }
        const {x, y, width: size, background: {extendLeft, extendRight, extendTop, extendBottom }} = this.measurements;
        drawing.addRectangle(
            x - extendLeft,
            y - extendTop,
            size + extendLeft + extendRight,
            size + extendTop + extendBottom,
            this.theme.backgroundColor
        )
    }

    public setTheme(theme: Theme): void {
        this.theme = theme;
        this.borders.forEach(b => b.setTheme(theme));
        const content = this.content;
        if(!content){
            return;
        }
        if(isMark(content)){
            content.setTheme(theme)
        }
    }

    public setGridTheme(theme: Theme){
        this.gridTheme = theme;
    }

    public displayX(): void {
        this.content = new X(this.measurements, this.theme);
    }
    public displayO(): void {
        this.content = new O(this.measurements, this.theme);
    }

    public displayGrid() {
        const newGrid = new GridImpl(
            this.measurements,
            this.theme,
            this
        );
        this.content = newGrid;
        return newGrid;
    }

    public clear(): void {
        this.content = undefined;
        this.theme = this.gridTheme;
    }

    public drawNew(drawing: Drawing): void {
        this.drawBackgroundNew(drawing);
        this.content?.draw(drawing);
    }
}

export class GridImpl  implements Grid {
    private overlayContent: Win | undefined;
    private readonly cellImpls: [
        GridCellImpl,
        GridCellImpl,
        GridCellImpl,
        GridCellImpl,
        GridCellImpl,
        GridCellImpl,
        GridCellImpl,
        GridCellImpl,
        GridCellImpl,
    ];
    private readonly leftVerticalBorder: GridBorder;
    private readonly rightVerticalBorder: GridBorder;
    private readonly topHorizontalBorder: GridBorder;
    private readonly bottomHorizontalBorder: GridBorder;
    private readonly lineWidth: number;
    public readonly cellSize: number;
    public get cells(){
        return this.cellImpls;
    }
    public constructor(
        measurements: GridCellMeasurements,
        public theme: Theme,
        private readonly cell: GridCellImpl | undefined
    ){
        const builder = new GridBuilder(measurements);
        this.leftVerticalBorder = new GridBorder(builder.getLeftVertical(), theme);
        this.rightVerticalBorder = new GridBorder(builder.getRightVertical(), theme);
        this.topHorizontalBorder = new GridBorder(builder.getTopHorizontal(), theme);
        this.bottomHorizontalBorder = new GridBorder(builder.getBottomHorizontal(), theme);
        const cellMeasurements = [...builder.getCellMeasurements()];
        this.cellImpls = [
            new GridCellImpl(
                cellMeasurements[0],
                [
                    new GridCellBorder(this.leftVerticalBorder, GridBorderPart.BeginningRight),
                    new GridCellBorder(this.topHorizontalBorder, GridBorderPart.BeginningLeft),
                ],
                theme
            ),
            new GridCellImpl(
                cellMeasurements[1],
                [
                    new GridCellBorder(this.leftVerticalBorder, GridBorderPart.BeginningLeft),
                    new GridCellBorder(this.rightVerticalBorder, GridBorderPart.BeginningRight),
                    new GridCellBorder(this.topHorizontalBorder, GridBorderPart.MiddleLeft),
                ],
                theme
            ),
            new GridCellImpl(
                cellMeasurements[2],
                [
                    new GridCellBorder(this.rightVerticalBorder, GridBorderPart.BeginningLeft),
                    new GridCellBorder(this.topHorizontalBorder, GridBorderPart.EndLeft),
                ],
                theme
            ),
            new GridCellImpl(
                cellMeasurements[3],
                [
                    new GridCellBorder(this.topHorizontalBorder, GridBorderPart.BeginningRight),
                    new GridCellBorder(this.leftVerticalBorder, GridBorderPart.MiddleRight),
                    new GridCellBorder(this.bottomHorizontalBorder, GridBorderPart.BeginningLeft),
                ],
                theme
            ),
            new GridCellImpl(
                cellMeasurements[4],
                [
                    new GridCellBorder(this.topHorizontalBorder, GridBorderPart.MiddleRight),
                    new GridCellBorder(this.leftVerticalBorder, GridBorderPart.MiddleLeft),
                    new GridCellBorder(this.rightVerticalBorder, GridBorderPart.MiddleRight),
                    new GridCellBorder(this.bottomHorizontalBorder, GridBorderPart.MiddleLeft),
                ],
                theme
            ),
            new GridCellImpl(
                cellMeasurements[5],
                [
                    new GridCellBorder(this.topHorizontalBorder, GridBorderPart.EndRight),
                    new GridCellBorder(this.rightVerticalBorder, GridBorderPart.MiddleLeft),
                    new GridCellBorder(this.bottomHorizontalBorder, GridBorderPart.EndLeft),
                ],
                theme
            ),
            new GridCellImpl(
                cellMeasurements[6],
                [
                    new GridCellBorder(this.leftVerticalBorder, GridBorderPart.EndRight),
                    new GridCellBorder(this.bottomHorizontalBorder, GridBorderPart.BeginningRight),
                ],
                theme
            ),
            new GridCellImpl(
                cellMeasurements[7],
                [
                    new GridCellBorder(this.leftVerticalBorder, GridBorderPart.EndLeft),
                    new GridCellBorder(this.rightVerticalBorder, GridBorderPart.EndRight),
                    new GridCellBorder(this.bottomHorizontalBorder, GridBorderPart.MiddleRight),
                ],
                theme
            ),
            new GridCellImpl(
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

    private drawBorders(drawing: Drawing): void {
        drawing.save();
        drawing.setLineWidth(this.lineWidth);
        drawing.setLineColor(this.theme.color);
        this.leftVerticalBorder.draw(drawing);
        this.rightVerticalBorder.draw(drawing);
        this.topHorizontalBorder.draw(drawing);
        this.bottomHorizontalBorder.draw(drawing);
        drawing.restore();
    }

    public draw(drawing: Drawing): void {
        this.cellImpls.forEach(c => c.drawNew(drawing));
        this.overlayContent?.draw(drawing);
        this.drawBorders(drawing);
    }

    public setTheme(theme: Theme): void{
        this.theme = theme;
        this.leftVerticalBorder.setTheme(theme);
        this.rightVerticalBorder.setTheme(theme);
        this.topHorizontalBorder.setTheme(theme);
        this.bottomHorizontalBorder.setTheme(theme);
        this.cellImpls.forEach(c => c.setGridTheme(theme))
        this.cellImpls.forEach(c => c.setTheme(theme))
        this.cell?.setTheme(theme);
        this.overlayContent?.setTheme(theme)
    }

    public displayWinner(winner: Winner | undefined): void {
        if(!winner){
            this.overlayContent = undefined;
            return;
        }
        const winnerStartContent = this.cellImpls[winner.three.positions[0]].content;
        const winnerEndContent = this.cellImpls[winner.three.positions[2]].content;
        if(!winnerStartContent || !isMark(winnerStartContent) || !winnerEndContent || !isMark(winnerEndContent)){
            return;
        }
        const win = new Win(
            this.theme,
            winnerStartContent.getWinStart(winner.three),
            winnerEndContent.getWinEnd(winner.three),
            getMarkLineWidth(this.cellSize)
        )
        this.overlayContent = win;
    }

    public static create(
        measurements: Measurements,
        theme: Theme
    ): GridImpl {
        return new GridImpl(
            {
                ...measurements,
                background: {
                    extendLeft: 0,
                    extendRight: 0,
                    extendTop: 0,
                    extendBottom: 0
                }
            },
            theme,
            undefined
        )
    }
}