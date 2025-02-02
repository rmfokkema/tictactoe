import { describe, beforeEach, it, expect, vi } from 'vitest'
import { createStore, RootTicTacToeStore } from '../src/scripts/store/create-store'
import { RevealedPosition } from '../src/scripts/state/revealed-position';
import { TicTacToeStore } from '../src/scripts/store/tictactoe-store';

describe('a store', () => {
    let store: RootTicTacToeStore;

    beforeEach(() => {
        store = createStore();
    })

    it('should not send an event back to the store that sent it', () => {
        let listener1: (e: RevealedPosition) => void;
        let listener2: (e: RevealedPosition) => void;
        const revealPositionMock1 = vi.fn();
        const revealPositionMock2 = vi.fn();
        const testStore1 = {
            addEventListener(type, listener){
                if(type === 'positionrevealed'){
                    listener1 = listener;
                }
            },
            revealPosition: revealPositionMock1
        } as unknown as TicTacToeStore;
        const testStore2 = {
            addEventListener(type, listener){
                if(type === 'positionrevealed'){
                    listener2 = listener;
                }
            },
            revealPosition: revealPositionMock2
        } as unknown as TicTacToeStore;
        store.connectStore(testStore1);
        store.connectStore(testStore2)

        listener1({} as unknown as RevealedPosition);
        expect(revealPositionMock2).toHaveBeenCalled();
        expect(revealPositionMock1).not.toHaveBeenCalled();
    })
})