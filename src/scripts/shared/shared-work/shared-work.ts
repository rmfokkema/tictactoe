import type { SerializedTree } from "../state/serialization";

export interface SharedWork {
    storeMap(map: SerializedTree): void
    verifyAndStoreMap(map: SerializedTree | undefined): void
    getStoredMap(): SerializedTree | undefined
}