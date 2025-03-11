import type { SharedWork } from "@shared/sharedworker/shared-work";

export type SharedWorkClient = {
    [Method in keyof SharedWork]: (...params: Parameters<SharedWork[Method]>) => Promise<ReturnType<SharedWork[Method]>>
}