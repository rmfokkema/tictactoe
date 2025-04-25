import { getQueryParamsForState, getStateFromQueryParams, isQueryParamForState } from '@shared/state/query-params'
import { EventDispatcher } from "../events/event-dispatcher";
import type { SelectionEventMap } from "./selection-event-map";
import type { RenderedSelection } from "./selector";

export interface UrlSelection extends RenderedSelection {
    load(): void
}

function removeStateQueryParams(url: URL): void {
    const stateQueryParamKeys = [...url.searchParams.entries()].filter(([k, v]) => isQueryParamForState(k, v)).map(e => e[0]);
    for(const key of stateQueryParamKeys){
        url.searchParams.delete(key);
    }
}

export function createUrlSelection(): UrlSelection {
    const eventDispatcher: EventDispatcher<SelectionEventMap> = new EventDispatcher({
        stateselected: [],
        unselected: []
    })
    return {
        load(){
            const url = new URL(window.location.href);
            const state = getStateFromQueryParams(url.searchParams);
            if(state){
                eventDispatcher.dispatchEvent('stateselected', state)
            }
        },
        select(state) {
            const canonical = state.getCanonical();
            const { key, value } = getQueryParamsForState(canonical);
            const url = new URL(window.location.href);
            removeStateQueryParams(url);
            url.searchParams.append(key, value);
            window.history.replaceState({}, '', url.toString());
        },
        unselect(){
            const url = new URL(window.location.href);
            removeStateQueryParams(url);
            window.history.replaceState({}, '', url.toString());
        },
        addEventListener(type, handler) {
            eventDispatcher.addEventListener(type, handler)
        },
        removeEventListener(type, handler) {
            eventDispatcher.removeEventListener(type, handler)
        },
    };
}