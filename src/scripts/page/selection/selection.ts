import type { EventTargetLike } from "../events/types";
import type { MapRendererEventMap, StateRenderer } from "../map";
import type { RenderedSelection } from "./selector";

export interface Selection extends StateRenderer, EventTargetLike<MapRendererEventMap> {
    useSelector(selector: RenderedSelection): void
}