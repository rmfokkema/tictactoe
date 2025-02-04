import { EventDispatcher } from "../events/event-dispatcher";
import { ClonedGameState, GameState } from "../state/game-state";
import { ClonedRevealedPosition, RevealedPosition, reviveClonedRevealedPosition } from "../state/revealed-position";
import { MapEventMap, MapStore } from "./map-store";

interface StateHiddenMessage {
    type: 'statehidden',
    data: ClonedGameState
}

interface PositionRevealedMessage {
    type: 'positionrevealed',
    data: ClonedRevealedPosition
}

type BroadcastChannelMessage = StateHiddenMessage | PositionRevealedMessage;

export function createBroadcastChannelMapStore(): MapStore {
    const eventDispatcher: EventDispatcher<MapEventMap> = new EventDispatcher({
        statehidden: [],
        positionrevealed: []
    })

    const channel = new BroadcastChannel('tictactoemap');
    channel.onmessage = (e) => {
        const data: BroadcastChannelMessage = e.data;
        if(data.type === 'statehidden'){
            eventDispatcher.dispatchEvent('statehidden', GameState.reviveCloned(data.data));
            return;
        }
        if(data.type === 'positionrevealed'){
            eventDispatcher.dispatchEvent('positionrevealed', reviveClonedRevealedPosition(data.data))
        }
    }

    return {
        addEventListener(type, listener){
            eventDispatcher.addEventListener(type, listener)
        },
        removeEventListener(type, listener){
            eventDispatcher.removeEventListener(type, listener)
        },
        hideState(state: GameState): void {
            channel.postMessage({
                type: 'statehidden',
                data: state
            })
        },
        revealPosition(position: RevealedPosition): void {
            channel.postMessage({
                type: 'positionrevealed',
                data: position
            })
        }
    }
}