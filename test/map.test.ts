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
        expect(contextMock.record).toMatchSnapshot();
    })

    it.skip('should draw a move', () => {
        createMap(
            renderer, 
            pointerEvents,
            {
                x: 0,
                y: 0,
                size: 900
            }
        )
        pointerEvents.dispatchEvent({type: 'pointerdown', pointerId: 0, offsetX: 150, offsetY: 150, pointerType: 'mouse'});
        pointerEvents.dispatchEvent({type: 'pointerup', pointerId: 0, offsetX: 150, offsetY: 150, pointerType: 'mouse'});
        pointerEvents.dispatchEvent({type: 'pointerdown', pointerId: 0, offsetX: 150, offsetY: 50, pointerType: 'mouse'});
        pointerEvents.dispatchEvent({type: 'pointerup', pointerId: 0, offsetX: 150, offsetY: 50, pointerType: 'mouse'});
        pointerEvents.dispatchEvent({type: 'pointerdown', pointerId: 0, offsetX: 116.6, offsetY: 50, pointerType: 'mouse'});
        pointerEvents.dispatchEvent({type: 'pointerup', pointerId: 0, offsetX: 116.6, offsetY: 50, pointerType: 'mouse'});
        renderer.render();
    })
})