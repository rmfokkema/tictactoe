import { EventDispatcher } from "../events/event-dispatcher";
import { MapEventMap, MapStore } from "./map-store";

export type EventOrigin = 'samePage' | 'otherPage'

export interface StoreConnectionOptions {
    receiveOrigins?: EventOrigin[]
    sendOrigin?: EventOrigin
}

export interface RootTicTacToeStore {
    connectMapStore(other: MapStore, options?: StoreConnectionOptions): void
}

type EventMapWithOrigin<TMap> = {
    [Type in keyof TMap]: {
        origin: EventOrigin | undefined,
        data: TMap[Type]
    }
};

type RootStoreEventMap = EventMapWithOrigin<MapEventMap>

class TicTacToeStoreImpl implements RootTicTacToeStore {
    private readonly eventDispatcher: EventDispatcher<RootStoreEventMap> = new EventDispatcher({
        statehidden: [],
        positionrevealed: []
    });

    private connectStoreEvents<
        TType extends keyof MapEventMap,
        TStore extends {addEventListener(type: TType, listener: (ev: MapEventMap[TType]) => void): void}
    >(
        type: TType,
        store: TStore,
        storeAction: (store: TStore, ev: MapEventMap[TType]) => void,
        options: StoreConnectionOptions | undefined
    ): void{
        const originsToReceive: EventOrigin[] | undefined = options ? options.receiveOrigins : undefined;
        const originFilter: (origin: EventOrigin | undefined) => boolean = originsToReceive 
            ? (origin) => !origin || originsToReceive.includes(origin)
            : () => true;
        const originToSend: EventOrigin | undefined = options && options.sendOrigin;
        const storeListener = ({origin, data}: RootStoreEventMap[TType]): void => {
            if(!originFilter(origin)){
                return;
            }
            storeAction(store, data);
        };
        this.eventDispatcher.addEventListener(type, storeListener);
        store.addEventListener(type, (e) => {
            this.eventDispatcher.removeEventListener(type, storeListener);
            this.eventDispatcher.dispatchEvent(type, {origin: originToSend, data: e} as RootStoreEventMap[TType]);
            this.eventDispatcher.addEventListener(type, storeListener);
        });
    }

    public connectMapStore(other: MapStore, options?: StoreConnectionOptions): void {
        this.connectStoreEvents('positionrevealed', other, (s, e) => s.revealPosition(e), options);
        this.connectStoreEvents('statehidden', other, (s, e) => s.hideState(e), options);
    }
}

export function createStore(): RootTicTacToeStore {
    return new TicTacToeStoreImpl();
}
