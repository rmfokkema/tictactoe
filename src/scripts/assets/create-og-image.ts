import { createSvgDrawing } from "./create-svg-drawing";
import { GridImpl } from '../shared/drawing/grid'
import type { Theme } from '../shared/drawing'

export function createOgImage(): string {
    const theme: Theme = {
        color: '#000',
        backgroundColor: 'rgba(0, 0, 0, 0)'
    };
    const drawing = createSvgDrawing(300, 300);
    const grid = GridImpl.create({
        x: 10,
        y: 10,
        width: 280,
        height: 280
    }, theme);

    const grid0 = grid.cells[0].displayGrid();
    grid0.cells[0].displayX();
    const grid01 = grid0.cells[1].displayGrid();
    const grid03 = grid0.cells[3].displayGrid();
    grid01.cells[0].displayX();
    grid01.cells[1].displayO();
    grid03.cells[0].displayX();
    grid03.cells[3].displayO();

    const grid2 = grid.cells[2].displayGrid();
    grid2.cells[2].displayX();
    const grid21 = grid2.cells[1].displayGrid();
    const grid25 = grid2.cells[5].displayGrid();
    grid21.cells[2].displayX();
    grid21.cells[1].displayO();
    grid25.cells[2].displayX();
    grid25.cells[5].displayO();

    const grid6 = grid.cells[6].displayGrid();
    grid6.cells[6].displayX();
    const grid63 = grid6.cells[3].displayGrid();
    const grid67 = grid6.cells[7].displayGrid();
    grid63.cells[6].displayX();
    grid63.cells[3].displayO();
    grid67.cells[6].displayX();
    grid67.cells[7].displayO();
    grid.draw(drawing);

    const grid8 = grid.cells[8].displayGrid();
    grid8.cells[8].displayX();
    const grid85 = grid8.cells[5].displayGrid();
    const grid87 = grid8.cells[7].displayGrid();
    grid85.cells[8].displayX();
    grid85.cells[5].displayO();
    grid87.cells[8].displayX();
    grid87.cells[7].displayO();
    grid.draw(drawing);
    drawing.prepend(`<style>@media(prefers-color-scheme: dark){line, circle{stroke: #fff;}}</style>`)
    return drawing.getResult();
}