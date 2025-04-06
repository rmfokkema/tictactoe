import type { TransformationRepresentation } from "ef-infinite-canvas";
import type { CustomPointerEventDispatcher, Gesture, GestureReplaceFn } from "./types";

export class NoopGesture implements Gesture {
    public constructor(
        private readonly rootTarget: CustomPointerEventDispatcher,
        private readonly replaceGesture: GestureReplaceFn
    ){

    }

    public handlePointerDown(event: PointerEvent, transformation: TransformationRepresentation): void {
        const target = this.rootTarget.findTarget(event.offsetX, event.offsetY);
        if(!target){
            return;
        }
        this.replaceGesture((factory) => {
            return factory.createPointerDown(target, {
                offsetX: event.offsetX,
                offsetY: event.offsetY,
                pointerId: event.pointerId,
                transformation
            })
        })
    }

    public handleTransformationChange(): void {
        
    }

    public handlePointerUp(): void {
        
    }

    public handlePointerCancel(): void {
        
    }
}