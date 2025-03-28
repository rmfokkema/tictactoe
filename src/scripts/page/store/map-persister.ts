import type { SerializedTree } from "@shared/state/serialization";
import type { LocalMapPersister } from "./local-map-persister";
import type { AsyncWork } from "@shared/remote-communication";
import type { SharedWork } from "@shared/shared-work/shared-work";

export interface MapPersister {
    persist(map: SerializedTree): Promise<void>
    read(): Promise<SerializedTree | undefined>
}

export function createMapPersister(
    localPersister: LocalMapPersister,
    sharedWorkClient: AsyncWork<SharedWork>
): MapPersister {
    return {
        async persist(map: SerializedTree){
            localPersister.persist(map);
            await sharedWorkClient.storeMap(map);
        },
        async read(){
            const fromLocal = localPersister.read();
            await sharedWorkClient.verifyAndStoreMap(fromLocal);
            const verified = await sharedWorkClient.getStoredMap();
            return verified;
        }
    }
}