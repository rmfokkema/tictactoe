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
    })

    it('should draw', () => {
        createMap(
            renderer, 
            pointerEvents,
            {
                x: 0,
                y: 0,
                size: 100
            }
        );
        renderer.render();
        expect(contextMock.getRecord()).toMatchSnapshot();
    })

    it('should draw moves', () => {
        createMap(
            renderer, 
            pointerEvents,
            {
                x: 0,
                y: 0,
                size: 900
            }
        )
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