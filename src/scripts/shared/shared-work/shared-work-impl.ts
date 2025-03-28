import type { SharedWork } from "./shared-work";
import { GameStateTreeImpl } from "../state/game-state-tree-impl";
import type { SerializedTree } from "../state/serialization";
import type { SharedWorkState } from "./shared-work-state";
import type { DuplicableWork } from "../remote-communication";

export class SharedWorkImpl implements SharedWork, DuplicableWork<SharedWorkState> {
    private verifiedStoredMap: SerializedTree | undefined;
    private hasBeenVerified = false;
    public storeMap(map: SerializedTree){
        this.verifiedStoredMap = map;
    }
    public verifyAndStoreMap(map: SerializedTree | undefined){
        if(this.hasBeenVerified){
            return;
        }
        if(!map){
            this.hasBeenVerified = true;
            return;
        }
        const verified = GameStateTreeImpl.safeFromJSON(map);
        this.verifiedStoredMap = verified.toJSON();
        this.hasBeenVerified = true;
    }
    public getStoredMap(){
        return this.verifiedStoredMap;
    }
    public getState(): SharedWorkState {
        return {
            verifiedStoredMap: this.verifiedStoredMap,
            hasBeenVerified: this.hasBeenVerified
        }
    }
    public setState(state: SharedWorkState){
        this.verifiedStoredMap = state.verifiedStoredMap;
        this.hasBeenVerified = state.hasBeenVerified;
    }
}