import { describe, it, expect } from 'vitest'
import { Layout } from '@page/ui-impl/layout'

describe('a layout', () => {

    it('should add a child', () => {
        let layout = Layout.create(0, 0, 10, 10);
        const child = Layout.create(1, 1, 8, 8);
        layout = layout.addChild(child);

        const retrieved = layout.getChild([0]);
        expect(retrieved).toEqual(child);
    })

    it('should add a child a level deeper', () => {
        let layout = Layout.create(0, 0, 10, 10);
        const child = Layout.create(1, 1, 8, 8);
        layout = layout.addChild(child);
        const child2 = Layout.create(2, 2, 6, 6);
        layout = layout.addChild(child2, child);

        const retrieved = layout.getChild([0, 0]);
        expect(retrieved).toEqual(child2);
    })

    it('should translate', () => {
        const layout = Layout.create(0, 0, 10, 10).addChild(Layout.create(1, 1, 8, 8));
        const translated = layout.translate(10, 10);
        let {x, y, width, height} = translated;
        expect({x, y, width, height}).toEqual({
            x: expect.closeTo(10),
            y: expect.closeTo(10),
            width: expect.closeTo(10),
            height: expect.closeTo(10)
        });
        ({x, y, width, height} = translated.getChild([0])!);
        expect({x, y, width, height}).toEqual({
            x: expect.closeTo(11),
            y: expect.closeTo(11),
            width: expect.closeTo(8),
            height: expect.closeTo(8)
        })
    })

    it('should intersect', () => {
        const one = Layout.create(1, 1, 10, 10)
            .addChild(Layout.create(2, 2, 1, 1))
            .addChild(Layout.create(6, 6, 1, 1));
        const other = Layout.create(5,5, 20, 20);
        const result = one.intersect(other)!;

        let {x, y, width, height} = result;
        expect({x, y, width, height}).toEqual({
            x: expect.closeTo(5),
            y: expect.closeTo(5),
            width: expect.closeTo(6),
            height: expect.closeTo(6)
        });
        ({x, y, width, height} = result.getChild([0])!);
        expect({x, y, width, height}).toEqual({
            x: expect.closeTo(6),
            y: expect.closeTo(6),
            width: expect.closeTo(1),
            height: expect.closeTo(1)
        });
    })
})