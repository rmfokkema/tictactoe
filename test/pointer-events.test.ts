import { describe, it, expect, vi, beforeAll, type Mock, afterEach } from 'vitest'
import { mockPointerEvents, type PointerEventsMock } from './mock-pointer-events';
import type { CustomPointerEventTarget } from '@page/pointer-events/types';
import { createPointerEvents } from '@page/pointer-events/create-pointer-events';

vi.useFakeTimers();


describe('pointer events', () => {
    let pointerEvents: PointerEventsMock;
    let rootEventTarget: CustomPointerEventTarget;
    let rootEventListenerMock: Mock;

    beforeAll(() => {
        pointerEvents = mockPointerEvents();
        rootEventTarget = createPointerEvents(pointerEvents);
        rootEventListenerMock = vi.fn();
        rootEventTarget.addEventListener('click', rootEventListenerMock)
    })

    afterEach(() => {
        vi.clearAllMocks();
    })

    it('should dispatch click on root', () => {
        pointerEvents.dispatchEvent({
            type: 'pointerdown',
            offsetX: 100,
            offsetY: 100,
            pointerId: 0
        })
        pointerEvents.dispatchEvent({
            type: 'pointerup',
            offsetX: 100,
            offsetY: 100,
            pointerId: 0
        })
        expect(rootEventListenerMock).toHaveBeenCalledWith({
            type: 'click'
        })
    })

    it('should not dispatch click in case of another pointer', () => {
        pointerEvents.dispatchEvent({
            type: 'pointerdown',
            offsetX: 100,
            offsetY: 100,
            pointerId: 0
        })
        pointerEvents.dispatchEvent({
            type: 'pointerdown',
            offsetX: 200,
            offsetY: 100,
            pointerId: 1,
        })
        pointerEvents.dispatchEvent({
            type: 'pointerup',
            offsetX: 100,
            offsetY: 100,
            pointerId: 0
        })
        pointerEvents.dispatchEvent({
            type: 'pointerup',
            offsetX: 200,
            offsetY: 100,
            pointerId: 1,
        })
        expect(rootEventListenerMock).not.toHaveBeenCalled();
    })


    describe('with children with areas', () => {
        let area1EventTarget: CustomPointerEventTarget;
        let area1EventListenerMock: Mock;

        let area1Child1EventTarget: CustomPointerEventTarget;
        let area1Child1EventListenerMock: Mock;

        let area2EventTarget: CustomPointerEventTarget;

        let area2Child2EventTarget: CustomPointerEventTarget;
        let area2Child2EventListenerMock: Mock;

        beforeAll(() => {
            area1EventTarget = rootEventTarget.addChildForArea({x: 0, y: 0, width: 10, height: 10});
            area1EventListenerMock = vi.fn();

            area1Child1EventTarget = area1EventTarget.addChildForArea({x: 2, y: 4, width: 2, height: 2});
            area1Child1EventListenerMock = vi.fn();
            area1Child1EventTarget.addEventListener('click', area1Child1EventListenerMock);
            area1Child1EventTarget.addEventListener('dblclick', area1Child1EventListenerMock)

            area2EventTarget = rootEventTarget.addChildForArea({x: 12, y: 0, width: 10, height: 10});

            area2Child2EventTarget = area2EventTarget.addChildForArea({x: 18, y: 4,  width: 2, height: 2});
            area2Child2EventListenerMock = vi.fn();
            area2Child2EventTarget.addEventListener('click', area2Child2EventListenerMock);
        })

        it('should call listener on child', () => {
            pointerEvents.dispatchEvent({
                type: 'pointerdown',
                offsetX: 3,
                offsetY: 5,
                pointerId: 0
            })

            pointerEvents.dispatchEvent({
                type: 'pointerup',
                offsetX: 3,
                offsetY: 5,
                pointerId: 0
            })
            expect(area1Child1EventListenerMock).toHaveBeenCalledWith({
                type: 'click'
            })

            pointerEvents.dispatchEvent({
                type: 'pointerdown',
                offsetX: 19,
                offsetY: 5,
                pointerId: 0
            })


            pointerEvents.dispatchEvent({
                type: 'pointerup',
                offsetX: 19,
                offsetY: 5,
                pointerId: 0
            })
            expect(area2Child2EventListenerMock).toHaveBeenCalledWith({
                type: 'click'
            })
        })


        it('should dispatch two clicks', () => {
            pointerEvents.dispatchEvent({
                type: 'pointerdown',
                offsetX: 3,
                offsetY: 5,
                pointerId: 0
            })
            pointerEvents.dispatchEvent({
                type: 'pointerup',
                offsetX: 3,
                offsetY: 5,
                pointerId: 0
            })
            expect(area1Child1EventListenerMock).toHaveBeenCalledWith({
                type: 'click'
            })
            vi.advanceTimersByTime(1000);
            area1Child1EventListenerMock.mockClear();
            pointerEvents.dispatchEvent({
                type: 'pointerdown',
                offsetX: 3,
                offsetY: 5,
                pointerId: 0
            })
            pointerEvents.dispatchEvent({
                type: 'pointerup',
                offsetX: 3,
                offsetY: 5,
                pointerId: 0
            })
            expect(area1Child1EventListenerMock).toHaveBeenCalledWith({
                type: 'click'
            })
        })

        it('should dispatch dblclick', () => {
            vi.advanceTimersByTime(1000);
            pointerEvents.dispatchEvent({
                type: 'pointerdown',
                offsetX: 3,
                offsetY: 5,
                pointerId: 0
            })
            pointerEvents.dispatchEvent({
                type: 'pointerup',
                offsetX: 3,
                offsetY: 5,
                pointerId: 0
            })
            vi.advanceTimersByTime(300);
            pointerEvents.dispatchEvent({
                type: 'pointerdown',
                offsetX: 3,
                offsetY: 5,
                pointerId: 0
            })
            pointerEvents.dispatchEvent({
                type: 'pointerup',
                offsetX: 3,
                offsetY: 5,
                pointerId: 0
            })
            expect(area1Child1EventListenerMock).toHaveBeenCalledWith({
                type: 'dblclick'
            })
        })
    })
})