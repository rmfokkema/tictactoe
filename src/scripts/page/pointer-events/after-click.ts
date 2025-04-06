import type { TransformationRepresentation } from "ef-infinite-canvas";
import type { CustomPointerEventDispatcher, Gesture, GestureReplaceFn } from "./types";

export class AfterClick implements Gesture {
    private timeout: ReturnType<typeof setTimeout>;
    public constructor(
        private readonly replaceGesture: GestureReplaceFn,
        private readonly rootTarget: CustomPointerEventDispatcher,
        private readonly target: CustomPointerEventDispatcher,
    ){
        this.timeout = setTimeout(() => replaceGesture((factory) => factory.createNoop()), 500)
    }

    public handlePointerDown(event: PointerEvent, transformation: TransformationRepresentation): void{
        clearTimeout(this.timeout);
        const target = this.rootTarget.findTarget(event.offsetX, event.offsetY);
        if(!target){
            return;
        }
        if(target !== this.target){
            this.replaceGesture((factory) => factory.createPointerDown(target, {
                offsetX: event.offsetX,
                offsetY: event.offsetY,
                pointerId: event.pointerId,
                transformation
            }))
        }else{
            this.replaceGesture((factory) => factory.createPointerDownAgain(target, {
                offsetX: event.offsetX,
                offsetY: event.offsetY,
                pointerId: event.pointerId,
                transformation
            }))
        }
    }

    public handleTransformationChange(): void {
        
    }

    public handlePointerUp(): void {
        
    }

    public handlePointerCancel(): void {
        
    }
}