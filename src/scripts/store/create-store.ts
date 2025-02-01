import { EventDispatcher } from "../events/event-dispatcher";
import { GameState } from "../state/game-state";
import { RevealedPosition } from "../state/revealed-position";
import { TicTacToeEventMap, TicTacToeStore, TicTacToeStoreMutations } from "./tictactoe-store";

export interface RootTicTacToeStore extends TicTacToeStore{
    connectStore(other: TicTacToeStore): void
}
class TicTacToeStoreImpl implements TicTacToeStore {
    private readonly eventDispatcher: EventDispatcher<TicTacToeEventMap> = new EventDispatcher({
        statehidden: [],
        positionrevealed: []
    });

    public hideState(state: GameState): void {
        this.eventDispatcher.dispatchEvent('statehidden', state);
    }
    public revealPosition(position: RevealedPosition): void {
        this.eventDispatcher.dispatchEvent('positionrevealed', position);
    }

    public addEventListener<TType extends keyof TicTacToeEventMap>(type: TType, listener: (ev: TicTacToeEventMap[TType]) => void): void {
        this.eventDispatcher.addEventListener(type, listener);
    }
    public removeEventListener<TType extends keyof TicTacToeEventMap>(type: TType, listener: (ev: TicTacToeEventMap[TType]) => void): void {
        this.eventDispatcher.removeEventListener(type, listener);
    }

    public connectStore(other: TicTacToeStore): void {
        this.addEventListener('positionrevealed', (p) => other.revealPosition(p));
        this.addEventListener('statehidden', (s) => other.hideState(s));
        other.addEventListener('positionrevealed', p => this.revealPosition(p));
        other.addEventListener('statehidden', s => this.hideState(s));
    }
}

export function createStore(): RootTicTacToeStore {
    return new TicTacToeStoreImpl();
}