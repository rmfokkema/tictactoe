import type { TransformationEvent, TransformationRepresentation } from "ef-infinite-canvas";
import { transformPosition } from "./transform-position";
import type { CustomPointer, CustomPointerDownEventProperties } from "./types";


class TransformedPoint {
    private constructor(
        private readonly offsetX: number,
        private readonly offsetY: number,
        private readonly screenX: number,
        private readonly screenY: number
    ){}

    public isMovedBy(transformationEvent: TransformationEvent): boolean {
        const {x: newScreenX, y: newScreenY} = transformPosition(transformationEvent.inverseTransformation, this.offsetX, this.offsetY);
        const diffX = newScreenX - this.screenX;
        const diffY = newScreenY - this.screenY;
        const dist = diffX ** 2 + diffY ** 2;
        return dist > 9;
    }

    public static create(offsetX: number, offsetY: number, transformation: TransformationRepresentation): TransformedPoint {
        const {x: screenX, y: screenY} = transformPosition(transformation, offsetX, offsetY);
        return new TransformedPoint(
            offsetX,
            offsetY,
            screenX,
            screenY
        )
    }
}
export class CustomPointerImpl implements CustomPointer {
    private constructor(
        public id: number,
        private readonly point: TransformedPoint,
        private readonly point2: TransformedPoint
    ){}

    public isCancelledBy(transformationEvent: TransformationEvent): boolean {
        return this.point.isMovedBy(transformationEvent) || this.point2.isMovedBy(transformationEvent);
    }

    public static create(props: CustomPointerDownEventProperties): CustomPointerImpl {
        const point = TransformedPoint.create(props.offsetX, props.offsetY, props.transformation);
        const point2 = TransformedPoint.create(props.offsetX + 10, props.offsetY, props.transformation);
        return new CustomPointerImpl(props.pointerId, point, point2)
    }
}