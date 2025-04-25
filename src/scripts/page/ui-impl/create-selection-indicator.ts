import type { InfiniteCanvasRenderingContext2D } from "ef-infinite-canvas";
import type { Grid } from '@shared/drawing/grid'
import type { Theme } from "../themes";
import type { Renderable, Rerenderer } from "../renderer/types";
import type { EquivalentPositions } from "@shared/state/equivalent-positions";
import type { Measurements, Point } from "@shared/drawing";
import type { Selector } from "../selection/selector";
import type { Themeable } from "../ui/themeable";

export interface SelectionIndicator extends Renderable, Themeable<Theme>, Selector {

}

interface Interval {
    start: number
    end: number
}

class SelectionAreaLayer {
    private horizontalIntervals: Interval[] = []
    private verticalIntervals: Interval[] = []
    private spaces: Measurements[] = []

    public constructor(private theme: Theme){

    }

    public setTheme(theme: Theme): void {
        this.theme = theme;
    }

    public draw(ctx: InfiniteCanvasRenderingContext2D): void {
        ctx.save();
        ctx.globalAlpha = .05;
        ctx.fillStyle = this.theme.color;
        for(const space of this.spaces){
            ctx.beginPath();
            ctx.rect(space.x + space.width, space.y, -space.width, space.height);
            ctx.moveToInfinityInDirection(1, 0)
            ctx.lineToInfinityInDirection(-1, 1);
            ctx.lineToInfinityInDirection(-1, -1);
            ctx.clip();
        }
        ctx.beginPath();
        for(const {start, end} of this.verticalIntervals){
            ctx.rect(-Infinity, start, Infinity, end - start);
        }
        for(const {start, end} of this.horizontalIntervals){
            ctx.rect(start, -Infinity, end - start, Infinity);
        }
        ctx.fill();
        ctx.restore();
    }

    public addVerticalInterval(interval: Interval): void {
        this.verticalIntervals.push(interval)
    }

    public addHorizontalInterval(interval: Interval): void {
        this.horizontalIntervals.push(interval)
    }

    public addSpace(space: Measurements): void{
        this.spaces.push(space);
    }
}

function extendToPoint(measurements: Measurements, {x,y}: Point): Measurements {
    const left = Math.min(measurements.x, x);
    const right = Math.max(measurements.x + measurements.width, x);
    const top = Math.min(measurements.y, y);
    const bottom = Math.max(measurements.y + measurements.height, y);
    return {
        x: left,
        y: top,
        width: right - left,
        height: bottom - top
    }
}

function getCenter(measurements: Measurements): Point {
    return {
        x: measurements.x + measurements.width / 2,
        y: measurements.y + measurements.height / 2
    }
}

function *createSelectionAreaLayers(
    gridAndEquivalentPositions: Iterable<{grid: Grid, equivalentPositions: Iterable<EquivalentPositions>}>,
    theme: Theme,
    gridCenter: Point
): Iterable<SelectionAreaLayer> {
    const result = new SelectionAreaLayer(theme);
    const moreGridsAndEquivalentPositions: {grid: Grid, equivalentPositions: Iterable<EquivalentPositions>}[] = [];
    let hasContent = false;
    for(const {grid, equivalentPositions} of gridAndEquivalentPositions){
        for(const equivalentPosition of equivalentPositions){
            const cell = grid.cells[equivalentPosition.position];
            const measurements = cell.measurements;
            result.addHorizontalInterval({start: measurements.x, end: measurements.x + measurements.width});
            result.addVerticalInterval({start: measurements.y, end: measurements.y + measurements.height});
            result.addSpace(extendToPoint(measurements, gridCenter));
            hasContent = true;
            const cellGrid = cell.grid;
            if(cellGrid){
                moreGridsAndEquivalentPositions.push({grid: cellGrid, equivalentPositions: equivalentPosition.successors()})
            }
        }
    }
    if(!hasContent){
        return;
    }
    yield result;
    yield* createSelectionAreaLayers(moreGridsAndEquivalentPositions, theme, gridCenter)
}

class SelectionArea {
    public constructor(private readonly layers: SelectionAreaLayer[]){

    }

    public draw(ctx: InfiniteCanvasRenderingContext2D): void {
        for(const layer of this.layers){
            layer.draw(ctx)
        }
    }

    public setTheme(theme: Theme): void {
        for(const layer of this.layers){
            layer.setTheme(theme)
        }
    }
}

function makeSelection<T>(items: T[]): T[] {
    const sourceLength = items.length;
    const minSourceIndex = Math.min(sourceLength - 1, 2);
    const intervalLength = 3;
    let resultIndex = 0;
    let sourceIndex;
    const result: T[] = [];
    while((sourceIndex = minSourceIndex + resultIndex) <= sourceLength - 1){
        if(resultIndex % intervalLength === 0 || sourceIndex === sourceLength - 1){
            result.push(items[sourceIndex])
        }
        resultIndex++;
    }
    return result;
}

export function createSelectionIndicator(
    grid: Grid,
    renderer: Rerenderer,
    initialTheme: Theme
): SelectionIndicator{
    let theme = initialTheme;
    let selectionArea: SelectionArea | undefined;
    return {
        draw(ctx) {
            if(selectionArea){
                selectionArea.draw(ctx);
            }
        },
        setTheme(value) {
            theme = value;
            if(selectionArea){
                selectionArea.setTheme(theme)
            }
        },
        select(state) {
            const layers = [...createSelectionAreaLayers([{grid, equivalentPositions: state.getEquivalentPositions()}], theme, getCenter(grid.measurements))];
            selectionArea = new SelectionArea(makeSelection(layers))
            renderer.rerender();
        },
        unselect(){
            selectionArea = undefined;
            renderer.rerender();
        }
    }
}