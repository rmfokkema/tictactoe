import type { SerializedTree } from "@shared/state/serialization";
import type { LocalMapPersister } from "./local-map-persister";
import type { SharedWorkClient } from "../sharedworker/shared-work-client";

export interface MapPersister {
    persist(map: SerializedTree): Promise<void>
    read(): Promise<SerializedTree | undefined>
}

export function createMapPersister(
    localPersister: LocalMapPersister,
    sharedWorkClient: SharedWorkClient
): MapPersister {
    return {
        async persist(map: SerializedTree){
            localPersister.persist(map);
            await sharedWorkClient.storeMap(map);
        },
        async read(){
            const fromLocal = localPersister.read();
            const verified = await sharedWorkClient.getVerifiedStoredMap(fromLocal);
            return verified;
        }
    }
}