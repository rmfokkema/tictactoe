import type { InfiniteCanvas, EventMap as InfiniteCanvasEventMap, TransformationRepresentation, TransformationEvent } from "ef-infinite-canvas"
import type { EventTargetLike } from "../events/types"
import type { Measurements } from "@shared/drawing"

export interface CustomPointerEvent {
    type: string
}

export interface CustomPointerEventMap {
    click: CustomPointerEvent & {type: 'click'}
    dblclick: CustomPointerEvent & {type: 'dblclick'}
}

export interface CustomPointerEventTarget extends EventTargetLike<CustomPointerEventMap> {
    addChildForArea(area: Measurements): CustomPointerEventTarget
    destroy(): void
}

export interface CustomPointerEventDispatcher extends CustomPointerEventTarget {
    findTarget(x: number, y: number): CustomPointerEventDispatcher | undefined
    dispatchClick(): void
    dispatchDoubleClick(): void
}

export type InfiniteCanvasPointerEventType = 'pointerdown' | 'pointerup' | 'pointercancel' | 'transformationchange'
export type PointerEventMapFromInfiniteCanvas = Pick<InfiniteCanvasEventMap, InfiniteCanvasPointerEventType>

export type PointerEventsFromInfiniteCanvas = EventTargetLike<PointerEventMapFromInfiniteCanvas> & Pick<InfiniteCanvas, 'inverseTransformation'>

export interface Gesture {
    handlePointerDown(event: PointerEvent, transformation: TransformationRepresentation): void
    handlePointerUp(event: PointerEvent): void
    handlePointerCancel(event: PointerEvent): void
    handleTransformationChange(event: TransformationEvent): void
}

export interface CustomPointerDownEventProperties {
    offsetX: number
    offsetY: number
    pointerId: number
    transformation: TransformationRepresentation
}

export interface CustomPointerDownAgainEventProperties {
    offsetX: number
    offsetY: number
    pointerId: number
    transformation: TransformationRepresentation
}

export interface GestureFactory {
    createNoop(): Gesture
    createPointerDown(
        target: CustomPointerEventDispatcher,
        props: CustomPointerDownEventProperties
    ): Gesture
    createAfterClick(target: CustomPointerEventDispatcher): Gesture
    createPointerDownAgain(target: CustomPointerEventDispatcher, props: CustomPointerDownAgainEventProperties): Gesture
}

export type GestureReplaceFn = (newValueFn: (factory: GestureFactory) => Gesture) => void