export type ClickEventType = 'down' | 'cancel' | 'up'

export interface ClickHandler{
    handleClick(click: ClickEvent): void
}
export interface ClickEventProperties{
    readonly type: ClickEventType
    readonly x: number
    readonly y: number
}
export interface AcceptedClickEvent extends ClickEventProperties{
    readonly type: Exclude<ClickEventType, 'down'>
}

export interface AcceptableClickEvent extends ClickEventProperties{
    accept(handler: ClickHandler): void
}

export interface ClickEvent extends AcceptableClickEvent{
    atTarget(target: ClickHandler): AcceptableClickEventAtTarget
    forChild(): DownwardsClickEvent
    maybeAccepted(): AcceptedClickEvent | undefined
}

export interface DownwardsClickEvent extends ClickEvent{
    readonly type: 'down'
    readonly accepted: boolean
}

export interface AcceptableClickEventAtTarget extends ClickEventProperties{
    readonly accepted: boolean
    readonly rejected: boolean
    accept(): void
    reject(): void
}

export type ClickEventAtTarget = AcceptedClickEvent | AcceptableClickEventAtTarget

export type NodeClickHandler = (click: ClickEventAtTarget) => void

export function isAccepted(eventAtTarget: ClickEventAtTarget): eventAtTarget is AcceptedClickEvent{
    const asAccepted = eventAtTarget as AcceptedClickEvent;
    return asAccepted.type === 'cancel' || asAccepted.type === 'up';
}

export interface ClickHandlerNode extends ClickHandler{
    onClick(handler: NodeClickHandler): void
    child(): ClickHandlerNode
    destroy(): void
}

export interface EventTargetLike<TMap>{
    addEventListener<TType extends keyof TMap>(type: TType, handler: (ev: TMap[TType]) => void): void
}

export type PointerEventType = 'pointerdown' | 'pointerup' | 'pointermove'
export type PointerEventMap = Pick<GlobalEventHandlersEventMap, PointerEventType>

export type PointerEventTargetLike = EventTargetLike<PointerEventMap>