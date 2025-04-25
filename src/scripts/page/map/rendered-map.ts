import type { Themeable } from "../ui";
import type { MapRendererEventMap } from "./map-renderer";
import type { EventTargetLike } from "../events/types";
import type { SelectionEventMap } from "../selection/selection-event-map";

export interface RenderedMapEventMap extends MapRendererEventMap, SelectionEventMap {

}
export interface RenderedMap<TTheme> extends Themeable<TTheme>, EventTargetLike<RenderedMapEventMap> {

}