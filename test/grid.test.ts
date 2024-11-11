import { describe, it, expect } from 'vitest'
import { Grid } from '../src/scripts/content/grid/grid'
import { GridCellMeasurements } from '../src/scripts/content/grid/types'
import { Theme } from '../src/scripts/themes'
import { mockContext } from './mock-context'

describe('a grid', () => {
    const measurements: GridCellMeasurements = {
        x: 0,
        y: 0,
        size: 100,
        background: {
            extendLeft: 0,
            extendRight: 0,
            extendTop: 0,
            extendBottom: 0
        }
    }
    const lightTheme: Theme = {
        color: '#000',
        backgroundColor: '#fff',
        get loserTheme(){return darkTheme;},
        get winnerTheme(){return lightTheme;}
    };
    const darkTheme: Theme = {
        color: '#fff',
        backgroundColor: '#000',
        get loserTheme(){return darkTheme;},
        get winnerTheme(){return lightTheme;}
    }


    it('should draw borders', () => {
        const context = mockContext();
        const grid = new Grid(measurements, lightTheme);
        grid.drawBorders(context.ctx);

        expect(context.record).toMatchSnapshot();
    })

    it('should change themes', () => {
        const context = mockContext();
        const grid = new Grid(measurements, lightTheme);
        grid.setTheme(darkTheme);

        grid.drawBorders(context.ctx);

        expect(context.record).toMatchSnapshot();

        context.reset();

        grid.cells[0].setTheme(lightTheme)
        grid.drawCells(context.ctx);

        expect(context.record).toMatchSnapshot();
    });

    it('should theme two adjacent cells', () => {
        const context = mockContext();
        const grid = new Grid(measurements, lightTheme);
        grid.cells[0].setTheme(darkTheme);
        grid.cells[1].setTheme(darkTheme);

        grid.drawBorders(context.ctx);

        expect(context.record).toMatchSnapshot();

        context.reset();

        grid.setTheme(darkTheme);

        grid.drawBorders(context.ctx);

        expect(context.record).toMatchSnapshot();
    })

    it('should theme six adjacent cells', () => {
        const context = mockContext();
        const grid = new Grid(measurements, lightTheme);
        grid.cells[0].setTheme(darkTheme);
        grid.cells[1].setTheme(darkTheme);
        grid.cells[2].setTheme(darkTheme);
        grid.cells[3].setTheme(darkTheme);
        grid.cells[4].setTheme(darkTheme);
        grid.cells[5].setTheme(darkTheme);

        grid.drawBorders(context.ctx);

        expect(context.record).toMatchSnapshot();
    })
})