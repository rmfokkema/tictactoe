import { describe, beforeEach, it, expect, vi } from 'vitest'
import { createStore, RootTicTacToeStore } from '../src/scripts/store/create-store'
import { RevealedPosition } from '../src/scripts/state/revealed-position';
import { MapStore } from '../src/scripts/store/map-store';

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
        } as unknown as MapStore;
        const testStore2 = {
            addEventListener(type, listener){
                if(type === 'positionrevealed'){
                    listener2 = listener;
                }
            },
            revealPosition: revealPositionMock2
        } as unknown as MapStore;
        store.connectMapStore(testStore1);
        store.connectMapStore(testStore2)

        listener1({} as unknown as RevealedPosition);
        expect(revealPositionMock2).toHaveBeenCalled();
        expect(revealPositionMock1).not.toHaveBeenCalled();
    });

    it('should not send event from origin that is not wanted', () => {
        let listener: (e: RevealedPosition) => void;
        const revealPositionMock1 = vi.fn();
        const revealPositionMock2 = vi.fn();
        const sendingStore = {
            addEventListener(type, _listener){
                if(type === 'positionrevealed'){
                    listener = _listener;
                }
            }
        } as unknown as MapStore;
        const receivingStore1 = {
            addEventListener(){},
            revealPosition: revealPositionMock1
        } as unknown as MapStore
        const receivingStore2 = {
            addEventListener(){},
            revealPosition: revealPositionMock2
        } as unknown as MapStore
        store.connectMapStore(sendingStore, {sendOrigin: 'otherPage'});
        store.connectMapStore(receivingStore1, {receiveOrigins: ['samePage']})
        store.connectMapStore(receivingStore2)

        listener({} as unknown as RevealedPosition);

        expect(revealPositionMock1).not.toHaveBeenCalled();
        expect(revealPositionMock2).toHaveBeenCalled();
    })
})