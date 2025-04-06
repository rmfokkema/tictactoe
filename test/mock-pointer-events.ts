import type { EventMap as InfiniteCanvasEventMap } from "ef-infinite-canvas"
import type { PointerEventsFromInfiniteCanvas, InfiniteCanvasPointerEventType } from '@page/pointer-events/types'

export type MockEvent = (Pick<InfiniteCanvasEventMap['pointerdown'], 'pointerId' | 'offsetX' | 'offsetY'> | InfiniteCanvasEventMap['transformationchange']) & {
    type: InfiniteCanvasPointerEventType
}
export interface PointerEventsMock extends PointerEventsFromInfiniteCanvas{
    dispatchEvent(event: MockEvent): void
}

export function mockPointerEvents(): PointerEventsMock {
    const listeners: {[key in InfiniteCanvasPointerEventType]: ((ev: InfiniteCanvasEventMap[key]) => void)[]} = {
        pointerdown: [],
        transformationchange: [],
        pointerup: [],
        pointercancel: []
    };

    return {
        addEventListener(type, listener){
            listeners[type].push(listener);
        },
        removeEventListener(){},
        dispatchEvent,
        inverseTransformation: {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0}
    };

    function dispatchEvent(event: MockEvent): void{
        for(const listener of listeners[event.type].slice()){
            // @ts-ignore
            listener(event);
        }
    }
}