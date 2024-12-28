import { Measurements } from "../measurements"

export interface EventTargetLike<TMap>{
    addEventListener<TType extends keyof TMap>(type: TType, handler: (ev: TMap[TType]) => void): void
}

export interface CustomPointerEvent {
    type: string
}

export interface CustomPointerEventMap {
    pointerdown: CustomPointerEvent & {
        type: 'pointerdown',
        allowCancel(): void
    }
    pointercancel: CustomPointerEvent & {type: 'pointercancel'}
    pointerup: CustomPointerEvent & {type: 'pointerup'}
}

export interface CustomPointerEventTarget extends EventTargetLike<CustomPointerEventMap> {
    addChildForArea(area: Measurements): CustomPointerEventTarget
    destroy(): void
}

export type PointerEventType = 'pointerdown' | 'pointerup' | 'pointermove'
export type PointerEventMap = Pick<GlobalEventHandlersEventMap, PointerEventType>

export type PointerEventTargetLike = EventTargetLike<PointerEventMap>