import type { SharedWork } from "@shared/sharedworker/shared-work";
import { GameStateTreeImpl } from "@shared/state/game-state-tree-impl";
import type { SerializedTree } from "@shared/state/serialization";

export class SharedWorkImpl implements SharedWork {
    private verifiedStoredMap: SerializedTree | undefined;
    private hasBeenVerified = false;
    public storeMap(map: SerializedTree){
        this.verifiedStoredMap = map;
    }
    public getVerifiedStoredMap(storedMap: SerializedTree | undefined) {
        if(this.hasBeenVerified){
            return this.verifiedStoredMap;
        }
        if(!storedMap){
            this.hasBeenVerified = true;
            return undefined;
        }

        const verified = GameStateTreeImpl.safeFromJSON(storedMap);
        this.verifiedStoredMap = verified.toJSON();
        this.hasBeenVerified = true;
        return this.verifiedStoredMap;
    }
}