import type { EventTargetLike } from "../events/types";

export interface ThemeAreaTrackerEventMap {
    change: {primary: boolean}
}

export interface ThemeAreaTracker extends EventTargetLike<ThemeAreaTrackerEventMap> {
    primary: boolean
}

