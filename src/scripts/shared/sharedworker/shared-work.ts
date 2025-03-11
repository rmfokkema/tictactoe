import type { SerializedTree } from "../state/serialization";

export interface SharedWork {
    storeMap(map: SerializedTree): void
    getVerifiedStoredMap(storedMap: SerializedTree | undefined): SerializedTree | undefined
}

export const allMethodNames: {[Method in keyof SharedWork]: true} = {
    getVerifiedStoredMap: true,
    storeMap: true
};