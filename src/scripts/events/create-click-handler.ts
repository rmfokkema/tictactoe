import { ClickHandlerNodeImpl } from "./click-handler-node-impl";
import { connectClickEvents } from "./connect-click-events";
import { ClickHandlerNode, EventTargetLike, PointerEventMap } from "./types";

export function createClickHandler(pointerEvents: EventTargetLike<PointerEventMap>): ClickHandlerNode{
    const handler = ClickHandlerNodeImpl.create();
    connectClickEvents(pointerEvents, handler);
    return handler;
}