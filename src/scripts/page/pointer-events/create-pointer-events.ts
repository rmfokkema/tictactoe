import type { TransformationEvent, TransformationRepresentation } from "ef-infinite-canvas";
import { PointerEventTargetImpl } from "./pointer-event-target-impl";
import { GestureFactoryImpl } from "./gesture-factory-impl";
import type { CustomPointerEventTarget, PointerEventsFromInfiniteCanvas, CustomPointerEventDispatcher, Gesture } from "./types";

class CustomPointerEventProducer {
    private gesture: Gesture;
    public constructor(
        rootTarget: CustomPointerEventDispatcher
    ){
        const gestureFactory = new GestureFactoryImpl(rootTarget, (oldValue, newValueFn) => this.replaceGesture(oldValue, newValueFn))
        this.gesture = gestureFactory.createNoop();
    }

    public handlePointerDown(event: PointerEvent, transformation: TransformationRepresentation): void {
        this.gesture.handlePointerDown(event, transformation);
    }

    public handlePointerUp(event: PointerEvent): void {
        this.gesture.handlePointerUp(event);
    }

    public handlePointerCancel(event: PointerEvent): void {
        this.gesture.handlePointerCancel(event)
    }

    public handleTransformationChange(event: TransformationEvent): void {
        this.gesture.handleTransformationChange(event);
    }

    private replaceGesture(oldValue: Gesture, newValueFn: () => Gesture): void {
        if(oldValue !== this.gesture){
            return;
        }
        this.gesture = newValueFn();
    }
}

export function createPointerEvents(
    pointerEvents: PointerEventsFromInfiniteCanvas
): CustomPointerEventTarget {
    const rootTarget = new PointerEventTargetImpl(undefined, undefined);
    const eventProducer = new CustomPointerEventProducer(rootTarget);
    pointerEvents.addEventListener('pointerdown', (ev) => {
        eventProducer.handlePointerDown(ev, pointerEvents.inverseTransformation);
    });
    pointerEvents.addEventListener('pointerup', (ev) => {
        eventProducer.handlePointerUp(ev);
    });
    pointerEvents.addEventListener('pointercancel', (ev) => {
        eventProducer.handlePointerCancel(ev)
    });
    pointerEvents.addEventListener('transformationchange', (ev) => {
        eventProducer.handleTransformationChange(ev);
    })
    return rootTarget;
}