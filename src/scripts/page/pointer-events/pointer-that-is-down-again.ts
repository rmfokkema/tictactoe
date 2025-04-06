import type { TransformationEvent } from "ef-infinite-canvas";
import type { CustomPointerDownAgainEventProperties, CustomPointerEventDispatcher, Gesture, GestureReplaceFn } from "./types";
import { transformPosition } from "./transform-position";

export class PointerThatIsDownAgain implements Gesture{
    public constructor(
        private readonly replaceGesture: GestureReplaceFn,
        private readonly target: CustomPointerEventDispatcher,
        private readonly props: CustomPointerDownAgainEventProperties,
        private readonly screenOffsetX: number,
        private readonly screenOffsetY: number
    ){}

    public handlePointerDown(event: PointerEvent): void {
        if(event.pointerId === this.props.pointerId){
            return;
        }
        this.replaceGesture((factory) => factory.createNoop())
    }

    public handleTransformationChange(event: TransformationEvent): void {
        const {x: newScreenX, y: newScreenY} = transformPosition(event.inverseTransformation, this.props.offsetX, this.props.offsetY);
        const diffX = newScreenX - this.screenOffsetX;
        const diffY = newScreenY - this.screenOffsetY;
        const dist = diffX ** 2 + diffY ** 2;
        if(dist > 9){
            this.replaceGesture((factory) => factory.createNoop())
        }
    }

    public handlePointerUp(event: PointerEvent): void {
        if(event.pointerId !== this.props.pointerId){
            return;
        }
        this.target.dispatchDoubleClick();
        this.replaceGesture((factory) => factory.createNoop())
    }

    public handlePointerCancel(event: PointerEvent): void {
        if(event.pointerId !== this.props.pointerId){
            return;
        }
        this.replaceGesture((factory) => factory.createNoop())
    }
}