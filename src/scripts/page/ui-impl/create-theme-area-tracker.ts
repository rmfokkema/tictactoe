import type { InfiniteCanvas } from "ef-infinite-canvas";
import type { ScreenPositionCalculator } from "./screen-position";
import { EventDispatcher } from "../events/event-dispatcher";
import type { ThemeAreaTracker, ThemeAreaTrackerEventMap } from "../themes/theme-area-tracker";

export function createThemeAreaTracker(
    infiniteCanvas: InfiniteCanvas,
    screenPositionCalculator: ScreenPositionCalculator
): ThemeAreaTracker {
    let currentlyPrimary = true;
    const eventDispatcher: EventDispatcher<ThemeAreaTrackerEventMap> = new EventDispatcher({
        change: []
    });
    infiniteCanvas.addEventListener('transformationend', ({ transformation }) => {
        const {inPrimary, inSecondary} = screenPositionCalculator.getScreenPosition(transformation);
        if(inPrimary && !inSecondary && !currentlyPrimary){
            currentlyPrimary = true;
            eventDispatcher.dispatchEvent('change', {primary: true});
            return;
        }
        if(inSecondary && !inPrimary && currentlyPrimary){
            currentlyPrimary = false;
            eventDispatcher.dispatchEvent('change', {primary: false});
            return;
        }
    });
    return {
        get primary(){return currentlyPrimary;},
        addEventListener(type, listener){
            eventDispatcher.addEventListener(type, listener);
        },
        removeEventListener(type, listener){
            eventDispatcher.removeEventListener(type, listener);
        },
    }
}