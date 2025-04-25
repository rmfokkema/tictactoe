import type { GameState } from '@shared/state/game-state';
import type { Selection } from './selection'
import type { Selector } from './selector'
import { EventDispatcher } from '../events/event-dispatcher';
import type { MapRendererEventMap } from '../map';

export function createSelection(): Selection {
    const selectors: Selector[] = [];
    const eventDispatcher: EventDispatcher<MapRendererEventMap> = new EventDispatcher({
        statehidden: [],
        staterevealed: []
    });
    let selectedState: GameState | undefined;
    return {
        addEventListener(type, handler) {
            eventDispatcher.addEventListener(type, handler);
        },
        removeEventListener(type, handler){
            eventDispatcher.removeEventListener(type, handler);
        },
        hideState(state) {
            if(selectedState && state.isPredecessorOf(selectedState)){
                unselect();
            }
        },
        revealState(){},
        useSelector(selector) {
            selector.addEventListener('stateselected', select);
            selector.addEventListener('unselected', unselect)
            selectors.push(selector);
        },
    }
    function select(state: GameState){
        selectedState = state;
        eventDispatcher.dispatchEvent('staterevealed', state)
        for(const selector of selectors){
            selector.select(state)
        }
    }
    function unselect(){
        selectedState = undefined;
        for(const selector of selectors){
            selector.unselect();
        }
    }
}