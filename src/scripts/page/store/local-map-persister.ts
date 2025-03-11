import type { SerializedTree } from "@shared/state/serialization";

export interface LocalMapPersister {
    persist(map: SerializedTree): void;
    read(): SerializedTree | undefined;
}