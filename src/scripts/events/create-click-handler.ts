import { ClickHandlerNodeImpl } from "./click-handler-node-impl";
import { connectClickEvents } from "./connect-click-events";
import { ClickHandlerNode, PointerEventTargetLike } from "./types";

export function createClickHandler(pointerEvents: PointerEventTargetLike): ClickHandlerNode{
    const handler = ClickHandlerNodeImpl.create();
    connectClickEvents(pointerEvents, handler);
    return handler;
}