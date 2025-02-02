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

    private connectStoreEvents<
        TType extends keyof TicTacToeEventMap,
        TStore extends {addEventListener(type: TType, listener: (ev: TicTacToeEventMap[TType]) => void): void}
    >(
        type: TType,
        store: TStore,
        storeAction: (store: TStore, ev: TicTacToeEventMap[TType]) => void
    ): void{
        const storeListener = (ev: TicTacToeEventMap[TType]): void => storeAction(store, ev);
        this.eventDispatcher.addEventListener(type, storeListener);
        store.addEventListener(type, (e) => {
            this.eventDispatcher.removeEventListener(type, storeListener);
            this.eventDispatcher.dispatchEvent(type, e);
            this.eventDispatcher.addEventListener(type, storeListener);
        });
    }

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
        this.connectStoreEvents('positionrevealed', other, (s, e) => s.revealPosition(e));
        this.connectStoreEvents('statehidden', other, (s, e) => s.hideState(e));
    }
}

export function createStore(): RootTicTacToeStore {
    return new TicTacToeStoreImpl();
}