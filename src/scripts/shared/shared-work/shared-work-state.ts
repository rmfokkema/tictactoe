import type { SerializedTree } from "../state/serialization";

export interface SharedWorkState {
    verifiedStoredMap: SerializedTree | undefined
    hasBeenVerified: boolean
}