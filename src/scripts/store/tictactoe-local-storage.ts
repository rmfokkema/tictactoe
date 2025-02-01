import { EventDispatcher } from "../events/event-dispatcher";
import { GameState } from "../state/game-state";
import { RevealedPosition } from "../state/revealed-position";
import { StorageState } from "./storage-state";
import { TicTacToeEventMap, TicTacToeStore } from "./tictactoe-store";

const POSITIONS = 'positions';

export class TicTacToeLocalStorage implements TicTacToeStore {
    private state: StorageState = StorageState.create();
    private eventDispatcher: EventDispatcher<TicTacToeEventMap> = new EventDispatcher({
        statehidden: [],
        positionrevealed: []
    })

    private persist(): void {
        const serialized = JSON.stringify(this.state);
        window.localStorage.setItem(POSITIONS, serialized);
    }

    public addEventListener<TType extends keyof TicTacToeEventMap>(type: TType, listener: (ev: TicTacToeEventMap[TType]) => void): void {
        this.eventDispatcher.addEventListener(type, listener);
    }

    public removeEventListener<TType extends keyof TicTacToeEventMap>(type: TType, listener: (ev: TicTacToeEventMap[TType]) => void): void {
        this.eventDispatcher.removeEventListener(type, listener);
    }

    public hideState(state: GameState): void {
        this.state.hideState(state);
        this.persist();
    }
    public revealPosition(position: RevealedPosition): void {
        this.state.revealPosition(position);
        this.persist();
    }

    public load(): void {
        const storedValue = window.localStorage.getItem(POSITIONS);
        if(storedValue === null){
            return;
        }
        const loadedState = StorageState.fromJSON(JSON.parse(storedValue));
        for(const revealed of loadedState.getRevealedPositions()){
            this.eventDispatcher.dispatchEvent('positionrevealed', revealed);
        }
        this.state = loadedState;
    }
}