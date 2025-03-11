import { EventDispatcher } from "../events/event-dispatcher";
import type { MapRendererEventMap, RemoteMapRenderer } from "../map";
import type { GameStateSummary } from "@shared/state/game-state-summary";
import { GameStateImpl } from "@shared/state/game-state-impl";
import type { GameState } from "@shared/state/game-state";

interface StateHiddenMessage {
    type: 'statehidden',
    data: GameStateSummary
}

interface StateRevealedMessage {
    type: 'staterevealed',
    data: GameStateSummary
}

type BroadcastChannelMessage = StateHiddenMessage | StateRevealedMessage;

function isClonedGameState(value: unknown): value is GameStateSummary {
    return !!value && typeof (value as GameStateSummary).positions === 'number';
}
function isBroadcastChannelMessage(value: unknown): value is BroadcastChannelMessage{
    if(!value){
        return false;
    }
    const cast = value as BroadcastChannelMessage;
    return (cast.type === 'statehidden' || cast.type === 'staterevealed') && isClonedGameState(cast.data);
}

export function createBroadcastChannelRenderer(
    channel: BroadcastChannel
): RemoteMapRenderer {
    const eventDispatcher: EventDispatcher<MapRendererEventMap> = new EventDispatcher({
        statehidden: [],
        staterevealed: []
    })

    channel.addEventListener('message', (e) => {
        const data = e.data;
        if(!data || !isBroadcastChannelMessage(data)){
            return;
        }
        if(data.type === 'statehidden'){
            eventDispatcher.dispatchEvent('statehidden', GameStateImpl.fromSummary(data.data));
            return;
        }
        if(data.type === 'staterevealed'){
            eventDispatcher.dispatchEvent('staterevealed', GameStateImpl.fromSummary(data.data))
        }
    })

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
                data: state.getSummary()
            })
        },
        revealState(state: GameState): void {
            channel.postMessage({
                type: 'staterevealed',
                data: state.getSummary()
            })
        }
    }
}