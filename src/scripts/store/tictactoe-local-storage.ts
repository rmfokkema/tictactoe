import { EventDispatcher } from "../events/event-dispatcher";
import { GameState } from "../state/game-state";
import { RevealedPosition } from "../state/revealed-position";
import { MapStorageState } from "./map-storage-state";
import { MapEventMap, MapStore } from "./map-store";

const POSITIONS = 'positions';

export class TicTacToeLocalStorage implements MapStore {
    private mapState: MapStorageState = MapStorageState.create();
    private eventDispatcher: EventDispatcher<MapEventMap> = new EventDispatcher({
        statehidden: [],
        positionrevealed: []
    })

    private persist(): void {
        const serialized = JSON.stringify(this.mapState);
        window.localStorage.setItem(POSITIONS, serialized);
    }

    public addEventListener<TType extends keyof MapEventMap>(type: TType, listener: (ev: MapEventMap[TType]) => void): void {
        this.eventDispatcher.addEventListener(type, listener);
    }

    public removeEventListener<TType extends keyof MapEventMap>(type: TType, listener: (ev: MapEventMap[TType]) => void): void {
        this.eventDispatcher.removeEventListener(type, listener);
    }

    public hideState(state: GameState): void {
        this.mapState.hideState(state);
        this.persist();
    }
    public revealPosition(position: RevealedPosition): void {
        this.mapState.revealPosition(position);
        this.persist();
    }

    public load(): void {
        const storedValue = window.localStorage.getItem(POSITIONS);
        if(storedValue === null){
            return;
        }
        const loadedState = MapStorageState.fromJSON(JSON.parse(storedValue));
        for(const revealed of loadedState.getRevealedPositions()){
            this.eventDispatcher.dispatchEvent('positionrevealed', revealed);
        }
        this.mapState = loadedState;
    }
}