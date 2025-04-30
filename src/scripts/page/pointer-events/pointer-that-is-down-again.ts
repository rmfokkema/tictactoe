import type { TransformationEvent } from "ef-infinite-canvas";
import type { CustomPointer, CustomPointerEventDispatcher, Gesture, GestureReplaceFn } from "./types";

export class PointerThatIsDownAgain implements Gesture{
    public constructor(
        private readonly replaceGesture: GestureReplaceFn,
        private readonly target: CustomPointerEventDispatcher,
        private readonly pointer: CustomPointer
    ){}

    public handlePointerDown(event: PointerEvent): void {
        if(event.pointerId === this.pointer.id){
            return;
        }
        this.replaceGesture((factory) => factory.createNoop())
    }

    public handleTransformationChange(event: TransformationEvent): void {
        if(this.pointer.isCancelledBy(event)){
            this.replaceGesture((factory) => factory.createNoop())
        }
    }

    public handlePointerUp(event: PointerEvent): void {
        if(event.pointerId !== this.pointer.id){
            return;
        }
        this.target.dispatchDoubleClick();
        this.replaceGesture((factory) => factory.createNoop())
    }

    public handlePointerCancel(event: PointerEvent): void {
        if(event.pointerId !== this.pointer.id){
            return;
        }
        this.replaceGesture((factory) => factory.createNoop())
    }
}