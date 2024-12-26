import { describe, it, expect, beforeEach } from 'vitest'
import { ContextMock, mockContext } from './mock-context';
import { mockRenderer, RendererMock } from './mock-renderer';
import { mockPointerEvents, PointerEventsMock } from './mock-pointer-events';
import { createMap } from '../src/scripts/create-map'

describe('a tictactoe map', () => {
    let contextMock: ContextMock;
    let renderer: RendererMock;
    let pointerEvents: PointerEventsMock;
    const move0Position0: [number, number] = [435, 245]

    beforeEach(() => {
        contextMock = mockContext();
        renderer = mockRenderer(contextMock.ctx);
        pointerEvents = mockPointerEvents();
        createMap(
            renderer, 
            pointerEvents,
            {width: 1295, height: 958}
        )
    })

    it('should draw', () => {
        renderer.render();
        expect(contextMock.getRecord()).toMatchSnapshot();
    })

    it('should not draw in case of a second pointer', () => {
        const [x, y] = move0Position0;
        const otherPositionX = x + 300;
        pointerEvents.dispatchEvent({type: 'pointerdown', pointerId: 0, offsetX: x, offsetY: y, pointerType: 'mouse'});
        pointerEvents.dispatchEvent({type: 'pointerdown', pointerId: 1, offsetX: otherPositionX, offsetY: y, pointerType: 'mouse'});
        pointerEvents.dispatchEvent({type: 'pointerup', pointerId: 0, offsetX: x, offsetY: y, pointerType: 'mouse'});
        pointerEvents.dispatchEvent({type: 'pointerup', pointerId: 1, offsetX: otherPositionX, offsetY: y, pointerType: 'mouse'});
        renderer.render();
        expect(contextMock.getRecord()).toMatchSnapshot();
    })

    it('should not draw when pointer moves', () => {
        const [x, y] = move0Position0;
        const otherPositionX = x + 100;
        pointerEvents.dispatchEvent({type: 'pointerdown', pointerId: 0, offsetX: x, offsetY: y, pointerType: 'mouse'});
        pointerEvents.dispatchEvent({type: 'pointermove', pointerId: 0, offsetX: otherPositionX, offsetY: y, pointerType: 'mouse'});
        pointerEvents.dispatchEvent({type: 'pointerup', pointerId: 0, offsetX: otherPositionX, offsetY: y, pointerType: 'mouse'});
        renderer.render();
        expect(contextMock.getRecord()).toMatchSnapshot();
    })

    it('should draw moves', () => {
        for(const [x, y] of [
            move0Position0, // position 0
            [433, 190], // 1
            [410, 192], // 3
            [402, 201], // 6
            [402, 201], // 4
            [402.7, 201.2], // 5
            [403.1, 201.5] // 8
        ]){
            pointerEvents.dispatchEvent({type: 'pointerdown', pointerId: 0, offsetX: x, offsetY: y, pointerType: 'mouse'});
            pointerEvents.dispatchEvent({type: 'pointerup', pointerId: 0, offsetX: x, offsetY: y, pointerType: 'mouse'});
        }
        renderer.render();
        expect(contextMock.getRecord()).toMatchSnapshot();
    })
})