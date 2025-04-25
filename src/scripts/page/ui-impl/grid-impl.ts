import type { CustomPointerEventMap, CustomPointerEventTarget } from "../pointer-events/types";
import type { Rerenderer } from "../renderer/types";
import type { Theme } from "../themes";
import {  
    type GridCell as GridGridCell,
    type Grid as GridGrid,
    GridImpl as GridGridImpl
} from "@shared/drawing/grid";
import type { Drawable, Drawing, Measurements } from '@shared/drawing'
import type { Grid, GridCell } from "../ui/grid";
import type { Winner } from "@shared/winner";

class GridCellImpl implements GridCell<Theme> {
    private theme: Theme;
    private eventTarget: CustomPointerEventTarget | undefined;
    private grid: GridImpl | undefined;
    public constructor(
        private readonly cell: GridGridCell,
        private readonly renderer: Rerenderer,
        private readonly gridEventTarget: CustomPointerEventTarget,
        gridTheme: Theme
    ){
        this.theme = gridTheme;
    }
    private ensureOwnEventTarget(): CustomPointerEventTarget {
        return this.eventTarget || (this.eventTarget = this.gridEventTarget.addChildForArea(this.cell.measurements));
    }
    public addEventListener<TType extends keyof CustomPointerEventMap>(type: TType, handler: (ev: CustomPointerEventMap[TType]) => void): void {
        this.ensureOwnEventTarget().addEventListener(type, handler);
    }
    public removeEventListener<TType extends keyof CustomPointerEventMap>(type: TType, handler: (ev: CustomPointerEventMap[TType]) => void): void {
        this.eventTarget?.removeEventListener(type, handler);
    }
    public setTheme(theme: Theme): void {
        this.theme = theme;
    }
    public displayX(): void{
        this.cell.displayX();
        this.renderer.rerender();
    }
    public displayO(): void {
        this.cell.displayO();
        this.renderer.rerender();
    }
    public displayGrid(): Grid<Theme> {
        const gridGrid = this.cell.displayGrid();
        const grid = new GridImpl(
            gridGrid,
            this.renderer,
            this.ensureOwnEventTarget(),
            this.theme
        );
        this.grid = grid;
        return grid;
    }
    public clear(): void {
        this.cell.clear();
        this.grid?.destroy();
        this.renderer.rerender();
    }
    public destroy(): void {
        this.eventTarget?.destroy();
    }
}

export class GridImpl implements Grid<Theme>, Drawable {
    private readonly cellImpls: [GridCellImpl, GridCellImpl, GridCellImpl, GridCellImpl, GridCellImpl, GridCellImpl, GridCellImpl, GridCellImpl, GridCellImpl];
    public get cells(){
        return this.cellImpls;
    }
    public constructor(
        private readonly grid: GridGrid,
        private readonly renderer: Rerenderer,
        eventTarget: CustomPointerEventTarget,
        public theme: Theme
    ){
        this.cellImpls = [
            new GridCellImpl(grid.cells[0], renderer, eventTarget, theme),
            new GridCellImpl(grid.cells[1], renderer, eventTarget, theme),
            new GridCellImpl(grid.cells[2], renderer, eventTarget, theme),
            new GridCellImpl(grid.cells[3], renderer, eventTarget, theme),
            new GridCellImpl(grid.cells[4], renderer, eventTarget, theme),
            new GridCellImpl(grid.cells[5], renderer, eventTarget, theme),
            new GridCellImpl(grid.cells[6], renderer, eventTarget, theme),
            new GridCellImpl(grid.cells[7], renderer, eventTarget, theme),
            new GridCellImpl(grid.cells[8], renderer, eventTarget, theme),
        ];
    }

    public setTheme(theme: Theme): void{
        this.theme = theme;
        this.grid.setTheme(theme);
        this.cellImpls.forEach(c => c.setTheme(theme))
    }

    public draw(drawing: Drawing): void {
        this.grid.draw(drawing);
    }

    public displayWinner(winner: Winner | undefined): void {
        this.grid.displayWinner(winner);
        this.renderer.rerender();
    }

    public destroy(): void {
        this.cellImpls.forEach(c => c.destroy());
    }

    public static create(
        renderer: Rerenderer,
        grid: GridGrid,
        eventTarget: CustomPointerEventTarget,
        theme: Theme
    ): GridImpl{
        return new GridImpl(grid, renderer, eventTarget, theme);
    }
}