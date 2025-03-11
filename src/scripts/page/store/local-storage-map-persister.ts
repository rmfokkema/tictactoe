import type { SerializedTree } from "@shared/state/serialization";
import type { LocalMapPersister } from "./local-map-persister";

const POSITIONS = 'positions';

export class LocalStorageMapPersister implements LocalMapPersister {
    public persist(map: SerializedTree): void {
        const stringified = JSON.stringify(map);
        window.localStorage.setItem(POSITIONS, stringified);
    }
    public read(): SerializedTree | undefined {
        const storedValue = window.localStorage.getItem(POSITIONS);
        if(storedValue === null){
            return;
        }
        try{
            return JSON.parse(storedValue);
        }catch{
            return undefined
        }
        
    }
}