import { describe, it, expect, beforeEach } from 'vitest'

import { ContextMock, mockContext } from './mock-context';
import { mockRenderer, RendererMock } from './mock-renderer';
import { mockPointerEvents, PointerEventsMock } from './mock-pointer-events';
import { createMap } from '../src/scripts/create-map'

describe('a tictactoe map', () => {
    let contextMock: ContextMock;
    let renderer: RendererMock;
    let pointerEvents: PointerEventsMock;

    beforeEach(() => {
        contextMock = mockContext();
        renderer = mockRenderer(contextMock.ctx);
        pointerEvents = mockPointerEvents();
        createMap(
            renderer, 
            pointerEvents,
            {
                x: 0,
                y: 0,
                size: 900
            }
        )
    })

    it('should draw', () => {
        renderer.render();
        expect(contextMock.getRecord()).toMatchSnapshot();
    })

    it('should not draw in case of a second pointer', () => {
        pointerEvents.dispatchEvent({type: 'pointerdown', pointerId: 0, offsetX: 150, offsetY: 150, pointerType: 'mouse'});
        pointerEvents.dispatchEvent({type: 'pointerdown', pointerId: 1, offsetX: 750, offsetY: 150, pointerType: 'mouse'});
        pointerEvents.dispatchEvent({type: 'pointerup', pointerId: 0, offsetX: 150, offsetY: 150, pointerType: 'mouse'});
        pointerEvents.dispatchEvent({type: 'pointerup', pointerId: 1, offsetX: 750, offsetY: 150, pointerType: 'mouse'});
        renderer.render();
        expect(contextMock.getRecord()).toMatchSnapshot();
    })

    it('should not draw when pointer moves', () => {
        pointerEvents.dispatchEvent({type: 'pointerdown', pointerId: 0, offsetX: 150, offsetY: 150, pointerType: 'mouse'});
        pointerEvents.dispatchEvent({type: 'pointermove', pointerId: 0, offsetX: 350, offsetY: 150, pointerType: 'mouse'});
        pointerEvents.dispatchEvent({type: 'pointerup', pointerId: 0, offsetX: 350, offsetY: 150, pointerType: 'mouse'});
        renderer.render();
        expect(contextMock.getRecord()).toMatchSnapshot();
    })

    it('should draw moves', () => {
        for(const [x, y] of [
            [150, 150], // position 0
            [150, 50], // 1
            [113, 50], // 3
            [104, 58], // 6
            [104, 58], // 4
            [105.2, 58.6], // 5
            [105.61, 58.93] // 8
        ]){
            pointerEvents.dispatchEvent({type: 'pointerdown', pointerId: 0, offsetX: x, offsetY: y, pointerType: 'mouse'});
            pointerEvents.dispatchEvent({type: 'pointerup', pointerId: 0, offsetX: x, offsetY: y, pointerType: 'mouse'});
        }
        renderer.render();
        expect(contextMock.getRecord()).toMatchSnapshot();
    })
})